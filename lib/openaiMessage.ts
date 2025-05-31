import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
})

export interface ChatMessage {
    role: "system" | "user" | "assistant"
    content: string
}

export interface OpenAIResponse {
    content: string
    usage?: {
        prompt_tokens: number
        completion_tokens: number
        total_tokens: number
    }
}

export class OpenAIService {
    private static instance: OpenAIService
    private conversationCache = new Map<string, ChatMessage[]>()
    private readonly MAX_CONVERSATION_LENGTH = 20
    private readonly MAX_CONTENT_LENGTH = 4000

    static getInstance(): OpenAIService {
        if (!OpenAIService.instance) {
            OpenAIService.instance = new OpenAIService()
        }
        return OpenAIService.instance
    }

    async generateResponse(
        userMessage: string,
        pdfContent: string | null,
        conversationHistory: Array<{ message_content: string; message_type: string }>,
        pdfId: string,
    ): Promise<OpenAIResponse> {
        try {
            const messages = this.buildMessages(userMessage, pdfContent, conversationHistory, pdfId)

            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages,
                max_tokens: 500,
                temperature: 0.7,
                presence_penalty: 0.1,
                frequency_penalty: 0.1,
                stream: false,
            })

            const response = completion.choices[0]?.message?.content || "I apologize, but I could not generate a response."

            // Update conversation cache
            this.updateConversationCache(pdfId, messages, response)

            return {
                content: response,
                usage: completion.usage
                    ? {
                        prompt_tokens: completion.usage.prompt_tokens,
                        completion_tokens: completion.usage.completion_tokens,
                        total_tokens: completion.usage.total_tokens,
                    }
                    : undefined,
            }
        } catch (error) {
            console.error("OpenAI API error:", error)
            throw new Error("Failed to generate AI response")
        }
    }

    private buildMessages(
        userMessage: string,
        pdfContent: string | null,
        conversationHistory: Array<{ message_content: string; message_type: string }>,
        pdfId: string,
    ): ChatMessage[] {
        // Check if we have cached conversation for this PDF
        const cachedMessages = this.conversationCache.get(pdfId) || []

        const systemMessage: ChatMessage = {
            role: "system",
            content: this.buildSystemPrompt(pdfContent),
        }

        // Build conversation from history if no cache or cache is stale
        if (cachedMessages.length === 0) {
            const messages: ChatMessage[] = [systemMessage]

            // Add recent conversation history (limit to prevent token overflow)
            const recentHistory = conversationHistory
                .slice(-this.MAX_CONVERSATION_LENGTH)
                .filter((msg) => msg.message_content.trim().length > 0)

            for (const msg of recentHistory) {
                messages.push({
                    role: msg.message_type === "user" ? "user" : "assistant",
                    content: msg.message_content,
                })
            }

            // Add current user message
            messages.push({
                role: "user",
                content: userMessage,
            })

            return messages
        }

        // Use cached messages and add current user message
        return [
            ...cachedMessages,
            {
                role: "user",
                content: userMessage,
            },
        ]
    }

    private buildSystemPrompt(pdfContent: string | null): string {
        const basePrompt = `You are an AI assistant helping users understand and analyze PDF documents. 
    Please provide helpful, accurate responses based on the document content. 
    If the user asks about something not in the document, let them know politely.
    Keep your responses concise but informative.`

        if (!pdfContent) {
            return `${basePrompt}\n\nNote: No PDF content is currently available for analysis.`
        }

        // Truncate content if too long to prevent token overflow
        const truncatedContent =
            pdfContent.length > this.MAX_CONTENT_LENGTH
                ? `${pdfContent.slice(0, this.MAX_CONTENT_LENGTH)}...\n\n[Content truncated due to length]`
                : pdfContent

        return `${basePrompt}\n\nHere is the content of the current PDF document:\n\n${truncatedContent}`
    }

    private updateConversationCache(pdfId: string, messages: ChatMessage[], response: string): void {
        // Keep only the system message and recent conversation
        const systemMessage = messages[0]
        const recentMessages = messages.slice(-this.MAX_CONVERSATION_LENGTH)

        const updatedMessages = [
            systemMessage,
            ...recentMessages.slice(1), // Skip system message from recent
            {
                role: "assistant" as const,
                content: response,
            },
        ]

        this.conversationCache.set(pdfId, updatedMessages)
    }

    clearConversationCache(pdfId?: string): void {
        if (pdfId) {
            this.conversationCache.delete(pdfId)
        } else {
            this.conversationCache.clear()
        }
    }
}

export const openAIService = OpenAIService.getInstance()
