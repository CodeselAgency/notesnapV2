import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/serverSupabase"
import { openAIService } from "@/lib/openaiMessage"

// Cache for PDF content to avoid repeated database queries
const pdfContentCache = new Map<string, { content: string; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function getPdfContent(pdfId: string): Promise<string | null> {
    // Check cache first
    const cached = pdfContentCache.get(pdfId)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.content
    }

    try {
        const supabase = await createClient()
        const { data, error } = await supabase.from("pdfs").select("extracted_content").eq("id", pdfId).single()

        if (error) throw error

        const content = data?.extracted_content || ""

        // Cache the content
        pdfContentCache.set(pdfId, {
            content,
            timestamp: Date.now(),
        })

        return content
    } catch (error) {
        console.error("Error fetching PDF content:", error)
        return null
    }
}

async function getNextMessageOrder(pdfId: string, userId: string): Promise<number> {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from("chat_messages")
            .select("message_order")
            .eq("pdf_id", pdfId)
            .eq("user_id", userId)
            .order("message_order", { ascending: false })
            .limit(1)

        if (error) throw error

        return data && data.length > 0 ? data[0].message_order + 1 : 1
    } catch (error) {
        console.error("Error getting next message order:", error)
        return 1
    }
}

async function saveMessage(
    messageContent: string,
    messageType: "user" | "assistant",
    pdfId: string,
    userId: string,
    messageOrder: number,
) {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from("chat_messages")
            .insert({
                user_id: userId,
                pdf_id: pdfId,
                message_content: messageContent,
                message_type: messageType,
                message_order: messageOrder,
                created_at: new Date().toISOString(),
            })
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error("Error saving message:", error)
        return null
    }
}

// GET: Fetch messages for a specific PDF
export async function GET(request: NextRequest) {
    if (request.method !== "GET") {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 })
    }

    try {
        const supabase = await createClient()

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const pdfId = searchParams.get("pdfId")

        if (!pdfId) {
            return NextResponse.json({ error: "PDF ID is required" }, { status: 400 })
        }

        const { data: messages, error } = await supabase
            .from("chat_messages")
            .select("*")
            .eq("pdf_id", pdfId)
            .eq("user_id", user.id)
            .order("message_order", { ascending: true })

        if (error) throw error

        const formattedMessages = messages.map((msg) => ({
            id: msg.id,
            message_content: msg.message_content,
            message_type: msg.message_type,
            message_order: msg.message_order,
            timestamp: msg.created_at, // Already an ISO string from Supabase
            pdfId: msg.pdf_id,
            userId: msg.user_id,
        }))

        return NextResponse.json({ messages: formattedMessages })
    } catch (error) {
        console.error("Error fetching messages:", error)
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
    }
}

// POST: Send message and get AI response
export async function POST(request: NextRequest) {
    if (request.method !== "POST") {
        return NextResponse.json({ message: "Method not allowed" }, { status: 405 })
    }

    try {
        const supabase = await createClient()

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const { message_content, pdf_id } = await request.json()

        if (!message_content || !pdf_id) {
            return NextResponse.json({ error: "Message content and PDF ID are required" }, { status: 400 })
        }

        const { data: profile, error: profileError } = await supabase.from("profiles").select("subscription_tier,messages_used").eq("id", user.id).single()

        if (profileError) {
            throw new Error("Failed to fetch profile")
        }

        const messagesUsed = profile?.messages_used
        const subscriptionTier = profile?.subscription_tier


        if (subscriptionTier === "free" && messagesUsed >= 100) {
            return NextResponse.json({ error: "You have reached your limit of messages for your tier. Please upgrade to a higher tier to send more messages." }, { status: 400 })
        }
        else if (subscriptionTier === "premium" && messagesUsed >= 1000) {
            return NextResponse.json({ error: "You have reached your limit of messages for your tier. Please upgrade to a higher tier to send more messages." }, { status: 400 })
        }
        else if (subscriptionTier === "pro" && messagesUsed >= 10000) {
            return NextResponse.json({ error: "You have reached your limit of messages for your tier. Please upgrade to a higher tier to send more messages." }, { status: 400 })
        }
        // Get next message order
        const nextOrder = await getNextMessageOrder(pdf_id, user.id)

        // Save user message
        const userMessage = await saveMessage(message_content, "user", pdf_id, user.id, nextOrder)
        if (!userMessage) {
            throw new Error("Failed to save user message")
        }

        // Get PDF content for context
        const pdfContent = await getPdfContent(pdf_id)

        // Get recent conversation history for context
        const { data: recentMessages } = await supabase
            .from("chat_messages")
            .select("message_content, message_type")
            .eq("pdf_id", pdf_id)
            .eq("user_id", user.id)
            .order("message_order", { ascending: false })
            .limit(10)

        const conversationHistory = recentMessages?.reverse() || []

        // Generate AI response using OpenAI service
        const aiResponse = await openAIService.generateResponse(message_content, pdfContent, conversationHistory, pdf_id)

        // Save AI message
        const aiMessage = await saveMessage(aiResponse.content, "assistant", pdf_id, user.id, nextOrder + 1)
        if (!aiMessage) {
            throw new Error("Failed to save AI message")
        }

        // Update messages used
        const { data: updatedProfile, error: updateError } = await supabase.from("profiles").update({ messages_used: messagesUsed + 1 }).eq("id", user.id).select().single()

        if (updateError) {
            throw new Error("Failed to update messages used")
        }

        return NextResponse.json({
            userMessage: {
                id: userMessage.id,
                message_content: userMessage.message_content,
                message_type: "user",
                message_order: userMessage.message_order,
                timestamp: userMessage.created_at, // ISO string from database
                pdfId: userMessage.pdf_id,
                userId: userMessage.user_id,
            },
            aiMessage: {
                id: aiMessage.id,
                message_content: aiMessage.message_content,
                message_type: "ai",
                message_order: aiMessage.message_order,
                timestamp: aiMessage.created_at, // ISO string from database
                pdfId: aiMessage.pdf_id,
                userId: aiMessage.user_id,
            },
            usage: aiResponse.usage,
        })
    } catch (error) {
        console.error("Error processing message:", error)
        return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
    }
}