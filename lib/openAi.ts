import { openai } from "@ai-sdk/openai"
import { generateObject, generateText } from "ai"
import { z } from "zod"

// Streamlined schema for summary and content only
const SummaryContentSchema = z.object({
    summary: z.string().describe("Concise, high-quality summary of the document (400-600 words)"),
    notes: z.array(z.string()),
    extractedContent: z.string().describe("Key textual content and main points from the document"),
    pageCount: z.number().describe("Estimated number of pages in the document"),
})

// Optimized function for summary and extracted content only
export async function processDirectPdfSummaryOnly(fileBuffer: Buffer, fileName: string) {
    try {
        console.log(`Processing PDF for summary only: ${fileName} (${fileBuffer.length} bytes)`)

        const result = await generateObject({
            model: openai("gpt-4o"),
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `Analyze this PDF document efficiently and provide:
1. A high-quality, concise summary (400-600 words) covering the main points, key insights, and conclusions
2. Extract the most important textual content and key information
3. 10-15 key notes/takeaways
4. Estimate the page count

Focus on quality over quantity. Be concise but comprehensive in capturing the essential information.`,
                        },
                        {
                            type: "file",
                            data: fileBuffer,
                            mimeType: "application/pdf",
                            filename: fileName,
                        },
                    ],
                },
            ],
            schema: SummaryContentSchema,
            temperature: 0.2, // Lower temperature for more focused, consistent output
        })

        console.log("PDF summary processing completed successfully")
        return {
            summary: result.object.summary,
            notes: result.object.notes,
            extractedContent: result.object.extractedContent,
            pageCount: result.object.pageCount,
        }
    } catch (error) {
        console.error("Error processing PDF summary:", error)

        // Lightweight fallback for summary only
        try {
            console.log("Attempting lightweight fallback...")
            const fallbackResult = await generateText({
                model: openai("gpt-4o"),
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Provide a concise summary of this PDF document's main points and key information.",
                            },
                            {
                                type: "file",
                                data: fileBuffer,
                                mimeType: "application/pdf",
                                filename: fileName,
                            },
                        ],
                    },
                ],
                temperature: 0.2,
                maxTokens: 800, // Limit tokens for cost efficiency
            })

            return {
                summary: fallbackResult.text,
                extractedContent: "Content extraction failed - using summary only",
                pageCount: 0,
            }
        } catch (fallbackError) {
            console.error("Fallback processing failed:", fallbackError)
            throw new Error("Failed to process PDF summary")
        }
    }
}

// Alternative ultra-lightweight version using generateText only
export async function processDirectPdfUltraLight(fileBuffer: Buffer, fileName: string) {
    try {
        console.log(`Ultra-light PDF processing: ${fileName}`)

        const result = await generateText({
            model: openai("gpt-4o"),
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `Extract and summarize the key information from this PDF:

Format your response as:
SUMMARY: [400-500 word summary of main points and insights]

KEY CONTENT: [Important textual content and data points]

PAGES: [Estimated page count]`,
                        },
                        {
                            type: "file",
                            data: fileBuffer,
                            mimeType: "application/pdf",
                            filename: fileName,
                        },
                    ],
                },
            ],
            temperature: 0.2,
            maxTokens: 1000, // Strict token limit for efficiency
        })

        // Parse the structured response
        const lines = result.text.split('\n')
        let summary = ''
        let extractedContent = ''
        let pageCount = 0

        let currentSection = ''
        for (const line of lines) {
            if (line.startsWith('SUMMARY:')) {
                currentSection = 'summary'
                summary = line.replace('SUMMARY:', '').trim()
            } else if (line.startsWith('KEY CONTENT:')) {
                currentSection = 'content'
                extractedContent = line.replace('KEY CONTENT:', '').trim()
            } else if (line.startsWith('PAGES:')) {
                const pageMatch = line.match(/\d+/)
                pageCount = pageMatch ? parseInt(pageMatch[0]) : 0
            } else if (line.trim() && currentSection === 'summary') {
                summary += ' ' + line.trim()
            } else if (line.trim() && currentSection === 'content') {
                extractedContent += ' ' + line.trim()
            }
        }

        return {
            summary: summary || result.text,
            extractedContent: extractedContent || "Content parsed from summary",
            pageCount,
        }
    } catch (error) {
        console.error("Ultra-light processing failed:", error)
        throw new Error("Failed to process PDF with ultra-light method")
    }
}


