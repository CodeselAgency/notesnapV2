import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/serverSupabase";
import { generateStudyMaterialsFromContent } from "@/lib/openai2";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { snapId } = await req.json();

    const { data: content, error: contentError } = await supabase.from("pdfs").select("extracted_content, summary").eq("id", snapId).single();

    if (contentError) {
      return NextResponse.json({ message: contentError.message }, { status: 500 })
    }

    const aiResult = await generateStudyMaterialsFromContent(content.extracted_content, content.summary);

    const { data: flashcardsData, error: flashcardsError } = await supabase.from("pdfs").update({
      flashcards: aiResult.flashcards.flashcards,
      quiz: aiResult.quiz.questions,
    }).eq("id", snapId);

    if (flashcardsError) {
      return NextResponse.json({ message: flashcardsError.message }, { status: 500 })
    }

    console.log(aiResult);

    return NextResponse.json(aiResult, { status: 200 })

  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json({ message: "Error generating flashcards" }, { status: 500 });
  }
}
