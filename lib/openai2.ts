import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { z } from "zod"

// Schema definitions
const FlashcardSchema = z.object({
    question: z.string().describe("Clear, concise question for the flashcard"),
    answer: z.string().describe("Accurate, detailed answer"),
    difficulty: z.enum(["easy", "medium", "hard"]).describe("Difficulty level of the flashcard"),
})

const QuizQuestionSchema = z.object({
    question: z.string().describe("Clear multiple-choice question"),
    options: z.array(z.string()).length(4).describe("Four answer options"),
    correctAnswer: z.number().min(0).max(3).describe("Index of correct answer (0-3)"),
    explanation: z.string().describe("Explanation of why the answer is correct"),
})

const FlashcardsResponseSchema = z.object({
    flashcards: z.array(FlashcardSchema).describe("Array of generated flashcards"),
    totalCount: z.number().describe("Total number of flashcards generated"),
})

const QuizResponseSchema = z.object({
    questions: z.array(QuizQuestionSchema).describe("Array of quiz questions"),
    totalCount: z.number().describe("Total number of questions generated"),
})

// Generate flashcards from extracted content
export async function generateFlashcardsFromContent(
    extractedContent: string,
    summary: string,
    options: {
        count?: number
        difficultyMix?: { easy: number; medium: number; hard: number }
        focusAreas?: string[]
    } = {}
) {
    const {
        count = 15,
        difficultyMix = { easy: 5, medium: 7, hard: 3 },
        focusAreas = []
    } = options

    try {
        console.log(`Generating ${count} flashcards from content...`)

        const focusInstruction = focusAreas.length > 0
            ? `Focus particularly on these areas: ${focusAreas.join(', ')}.`
            : ''

        const result = await generateObject({
            model: openai("gpt-4o"),
            messages: [
                {
                    role: "user",
                    content: `Create ${count} educational flashcards based on the following content.

SUMMARY:
${summary}

EXTRACTED CONTENT:
${extractedContent}

Requirements:
- Generate approximately ${difficultyMix.easy} easy, ${difficultyMix.medium} medium, and ${difficultyMix.hard} hard difficulty flashcards
- Cover the most important concepts, facts, and key points
- Make questions clear and answers comprehensive but concise
- Include a good mix of factual recall, conceptual understanding, and application
${focusInstruction}

Focus on creating high-quality, study-effective flashcards that help reinforce learning.`,
                },
            ],
            schema: FlashcardsResponseSchema,
            temperature: 0.3,
        })

        console.log(`Generated ${result.object.flashcards.length} flashcards successfully`)
        return result.object
    } catch (error) {
        console.error("Error generating flashcards:", error)
        throw new Error("Failed to generate flashcards from content")
    }
}

// Generate quiz questions from extracted content
export async function generateQuizFromContent(
    extractedContent: string,
    summary: string,
    options: {
        count?: number
        difficulty?: 'easy' | 'medium' | 'hard' | 'mixed'
        questionTypes?: string[]
        focusAreas?: string[]
    } = {}
) {
    const {
        count = 10,
        difficulty = 'mixed',
        questionTypes = ['factual', 'conceptual', 'analytical'],
        focusAreas = []
    } = options

    try {
        console.log(`Generating ${count} quiz questions from content...`)

        const difficultyInstruction = difficulty === 'mixed'
            ? 'Include a mix of easy, medium, and hard questions'
            : `Focus on ${difficulty} difficulty level questions`

        const focusInstruction = focusAreas.length > 0
            ? `Emphasize these topics: ${focusAreas.join(', ')}.`
            : ''

        const typeInstruction = `Include ${questionTypes.join(', ')} question types.`

        const result = await generateObject({
            model: openai("gpt-4o"),
            messages: [
                {
                    role: "user",
                    content: `Create ${count} multiple-choice quiz questions based on the following content.

SUMMARY:
${summary}

EXTRACTED CONTENT:
${extractedContent}

Requirements:
- ${difficultyInstruction}
- Each question must have exactly 4 answer options
- Provide clear explanations for correct answers
- ${typeInstruction}
- Cover the most important concepts and information
- Make distractors (wrong answers) plausible but clearly incorrect
${focusInstruction}

Create engaging, educational questions that test real understanding of the material.`,
                },
            ],
            schema: QuizResponseSchema,
            temperature: 0.3,
        })

        console.log(`Generated ${result.object.questions.length} quiz questions successfully`)
        return result.object
    } catch (error) {
        console.error("Error generating quiz questions:", error)
        throw new Error("Failed to generate quiz from content")
    }
}

// Generate both flashcards and quiz in one call (more efficient)
export async function generateStudyMaterialsFromContent(
    extractedContent: string,
    summary: string,
    options: {
        flashcardCount?: number
        quizCount?: number
        flashcardDifficulty?: { easy: number; medium: number; hard: number }
        focusAreas?: string[]
    } = {}
) {
    const {
        flashcardCount = 12,
        quizCount = 8,
        flashcardDifficulty = { easy: 4, medium: 6, hard: 2 },
        focusAreas = []
    } = options

    try {
        console.log("Generating combined study materials...")

        const CombinedSchema = z.object({
            flashcards: z.array(FlashcardSchema),
            quizQuestions: z.array(QuizQuestionSchema),
        })

        const focusInstruction = focusAreas.length > 0
            ? `Focus particularly on: ${focusAreas.join(', ')}.`
            : ''

        const result = await generateObject({
            model: openai("gpt-4o"),
            messages: [
                {
                    role: "user",
                    content: `Create comprehensive study materials based on this content:

SUMMARY:
${summary}

EXTRACTED CONTENT:
${extractedContent}

Generate:
1. ${flashcardCount} flashcards (${flashcardDifficulty.easy} easy, ${flashcardDifficulty.medium} medium, ${flashcardDifficulty.hard} hard)
2. ${quizCount} multiple-choice quiz questions with explanations

Requirements:
- Cover the most important concepts and information
- Ensure variety in question types and difficulty
- Make all content educational and study-effective
- Create clear, accurate questions and answers
${focusInstruction}`,
                },
            ],
            schema: CombinedSchema,
            temperature: 0.3,
        })

        console.log("Combined study materials generated successfully")
        return {
            flashcards: {
                flashcards: result.object.flashcards,
                totalCount: result.object.flashcards.length
            },
            quiz: {
                questions: result.object.quizQuestions,
                totalCount: result.object.quizQuestions.length
            }
        }
    } catch (error) {
        console.error("Error generating combined study materials:", error)
        throw new Error("Failed to generate study materials from content")
    }
}

// Utility function to generate targeted flashcards for specific topics
export async function generateTargetedFlashcards(
    extractedContent: string,
    summary: string,
    targetTopic: string,
    count: number = 10
) {
    try {
        console.log(`Generating ${count} targeted flashcards for: ${targetTopic}`)

        const result = await generateObject({
            model: openai("gpt-4o"),
            messages: [
                {
                    role: "user",
                    content: `Create ${count} flashcards specifically focused on "${targetTopic}" based on this content:

SUMMARY:
${summary}

EXTRACTED CONTENT:
${extractedContent}

Focus exclusively on information related to "${targetTopic}". Create questions that test understanding of this specific topic from multiple angles - definitions, applications, relationships, and implications.`,
                },
            ],
            schema: FlashcardsResponseSchema,
            temperature: 0.3,
        })

        return result.object
    } catch (error) {
        console.error("Error generating targeted flashcards:", error)
        throw new Error(`Failed to generate flashcards for topic: ${targetTopic}`)
    }
}