import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/serverSupabase"
import { processDirectPdfSummaryOnly } from "@/lib/openAi"

export const config = {
    api: {
        bodyParser: false,
    },
}

export async function POST(req: NextRequest) {
    if (req.method !== "POST") {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 })
    }

    try {
        const supabase = await createClient()

        // Get authenticated user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        // Parse form data
        const formData = await req.formData()
        let boardId = formData.get("boardId") as string | null
        if (boardId === "undefined") {
            boardId = null;
        }
        const file = formData.get("file") as File | null

        if (!file) {
            return NextResponse.json({ message: "No file provided" }, { status: 400 })
        }

        const { data: profile, error: profileError } = await supabase.from('profiles').select('pdfs_used,subscription_tier').eq('id', user.id);

        if (profileError) {
            return NextResponse.json({ message: profileError.message }, { status: 500 })
        }

        if (profile[0].subscription_tier === 'free' && profile[0].pdfs_used >= 3) {
            return NextResponse.json({ message: "You have reached your limit of 1 PDF upload per month. Please upgrade to a paid plan to upload more PDFs." }, { status: 400 })
        }


        // Validate file type
        if (file.type !== "application/pdf") {
            return NextResponse.json({ message: "Invalid file type, only PDF is allowed." }, { status: 400 })
        }

        // Check file size (10MB limit)
        const maxFileSize = 10 * 1024 * 1024
        if (file.size > maxFileSize) {
            return NextResponse.json(
                {
                    message: `File too large. Max size is ${maxFileSize / (1024 * 1024)}MB`,
                },
                { status: 400 },
            )
        }

        // Read file buffer
        const fileBuffer = Buffer.from(await file.arrayBuffer())

        // Generate unique filename
        const timestamp = Date.now()
        const fileName = `${timestamp}-${file.name}`
        const filePath = `${user.id}/${fileName}`

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage.from("pdfs").upload(filePath, fileBuffer, {
            contentType: file.type || "application/pdf",
            upsert: false,
        })

        if (error) {
            return NextResponse.json({ message: error.message }, { status: 400 })
        }

        // Get signed URL for the uploaded file
        const { data: urlData } = await supabase.storage.from("pdfs").createSignedUrl(filePath, 60 * 60 * 24) // 24 hours

        console.log("Processing PDF directly with OpenAI...")
        const startTime = Date.now()

        // Process PDF directly with OpenAI
        const aiResult = await processDirectPdfSummaryOnly(fileBuffer, file.name)

        const processingTime = (Date.now() - startTime) / 1000
        console.log(`PDF processed in ${processingTime.toFixed(2)} seconds`)

        // Create PDF record with all generated content
        const pdfFile = {
            board_id: boardId || null,
            file_name: file.name || fileName,
            file_size: file.size,
            file_url: urlData?.signedUrl || "",
            extracted_content: aiResult.extractedContent || "",
            page_count: aiResult.pageCount || 0,
            summary: aiResult.summary || "",
            flashcards: aiResult.flashcards || [],
            notes: aiResult.notes || [],
            quiz: aiResult.quiz || [],
            processing_status: "completed",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user_id: user.id,
        }

        const { data: pdfData, error: pdfError } = await supabase.from("pdfs").insert(pdfFile).select()

        if (pdfError) {
            console.error("PDF insert error:", pdfError)
            return NextResponse.json(
                {
                    message: "Failed to save PDF record",
                    error: pdfError.message,
                },
                { status: 500 },
            )
        }

        const { data: updatedProfile, error: updateError } = await supabase.from('profiles').update({ pdfs_used: profile[0].pdfs_used + 1 }).eq('id', user.id);

        if (updateError) {
            return NextResponse.json({ message: updateError.message }, { status: 500 })
        }

        console.log("PDF processing completed successfully:", {
            summaryLength: aiResult.summary?.length || 0,
            notesCount: aiResult.notes?.length || 0,
            flashcardsCount: aiResult.flashcards?.length || 0,
            quizCount: aiResult.quiz?.length || 0,
        })

        return NextResponse.json(
            {
                pdf: pdfData[0],
                processing: {
                    summary: !!aiResult.summary,
                    notes: aiResult.notes?.length || 0,
                    flashcards: aiResult.flashcards?.length || 0,
                    quiz: aiResult.quiz?.length || 0,
                },
            },
            { status: 200 },
        )
    } catch (error) {
        console.error("Upload PDF error:", error)
        let message = "Internal server error"
        if (error instanceof Error) {
            message = error.message
        }
        return NextResponse.json({ message }, { status: 500 })
    }
}
