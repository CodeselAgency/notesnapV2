import axios from "axios";

// PDF Processing Service API endpoint
const PDF_PROCESSING_SERVICE_URL =
    "https://notesaims.onrender.com" || "http://localhost:3001";

/**
 * Process a PDF file by sending it to the PDF processing microservice
 * @param {File} file - The PDF file to process
 * @returns {Promise<Object>} - Processing results including content and analysis
 */
export async function processPdfFile(file) {
    try {
        console.log(
            `Sending PDF for processing: ${file.name} (${file.size} bytes)`
        );

        // Validate file before sending
        if (!file || !file.size) {
            console.error("Invalid file provided to processPdfFile", file);
            throw new Error("Invalid file: file is empty or null");
        }

        if (file.type !== "application/pdf") {
            console.warn(`File might not be a PDF. Detected type: ${file.type}`);
        }

        // Create form data for the file upload
        const formData = new FormData();
        formData.append("file", file);

        // Log more details about the request
        console.log(`Sending request to ${PDF_PROCESSING_SERVICE_URL}/process`);

        // Send the file to the processing service
        const response = await axios.post(
            `${PDF_PROCESSING_SERVICE_URL}/process`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                timeout: 60000, // 60 seconds timeout for large files
            }
        );

        // Check if the response is valid
        if (!response || !response.data) {
            console.error("Empty response from PDF processing service");
            throw new Error("PDF service returned empty response");
        }

        if (!response.data.success) {
            console.error(
                "PDF processing failed:",
                response.data?.error || "Unknown error"
            );
            throw new Error(response.data?.error || "Failed to process PDF");
        }

        // Validate content
        const content = response.data.content;
        const contentValid = typeof content === "string";

        if (!contentValid) {
            console.error(
                "Invalid content received from PDF service:",
                typeof content
            );
            throw new Error("Invalid content received from PDF service");
        }

        if (!content || content.trim() === "") {
            console.warn("Empty content received from PDF service");
        } else {
            // Check if content might be too large for database
            const contentSize = content.length;
            console.log(
                `Received ${contentSize} characters of text from PDF service`
            );

            // For very large documents, provide a summary of size
            if (contentSize > 100000) {
                console.warn(
                    `Large document detected: ${(contentSize / 1000).toFixed(
                        1
                    )}KB of text. This may exceed database limits.`
                );

                // Log the first few characters to verify content quality
                console.log(
                    "Content preview (first 200 chars):",
                    content.substring(0, 200)
                );
            }
        }

        console.log("PDF processed successfully:", {
            contentLength: content?.length || 0,
            analysisReceived: !!response.data.analysis,
            analysis: response.data.analysis
                ? {
                    documentType: response.data.analysis.documentType,
                    pageCount: response.data.analysis.pageCount,
                    wordCount: response.data.analysis.wordCount,
                }
                : null,
        });

        return {
            content: content || "",
            analysis: response.data.analysis || {},
        };
    } catch (error) {
        console.error("Error processing PDF:", error);
        // Return empty content but don't throw, allowing the document to be created
        return {
            content: "",
            analysis: {
                documentType: "unknown",
                pageCount: 0,
                wordCount: 0,
                summary: `Processing failed: ${error.message}`,
            },
        };
    }
}

/**
 * Process a PDF from a URL by sending it to the PDF processing microservice
 * @param {string} url - URL of the PDF to process
 * @param {string} filename - Optional filename to use
 * @returns {Promise<Object>} - Processing results including content and analysis
 */
export async function processPdfFromUrl(url, filename) {
    try {
        console.log(`Sending PDF URL for processing: ${url}`);

        // Send the URL to the processing service
        const response = await axios.post(
            `${PDF_PROCESSING_SERVICE_URL}/process-url`,
            {
                url,
                filename,
            }
        );

        if (!response.data || !response.data.success) {
            throw new Error(response.data?.error || "Failed to process PDF from URL");
        }

        console.log("PDF from URL processed successfully:", {
            contentLength: response.data.content?.length || 0,
            analysisReceived: !!response.data.analysis,
        });

        return {
            content: response.data.content,
            analysis: response.data.analysis || {},
        };
    } catch (error) {
        console.error("Error processing PDF from URL:", error);
        throw new Error(`PDF URL processing failed: ${error.message}`);
    }
}

/**
 * Test the PDF processing service to verify it's working
 * @returns {Promise<boolean>} - True if the service is working
 */
export async function testPdfProcessingService() {
    try {
        console.log("Testing PDF processing service connection...");

        // First, test the service's health endpoint
        const healthResponse = await axios.get(`${PDF_PROCESSING_SERVICE_URL}/`, {
            timeout: 5000,
        });

        if (!healthResponse.data || !healthResponse.data.status === "ok") {
            console.error("PDF service health check failed:", healthResponse.data);
            return false;
        }

        console.log("PDF service health check passed", healthResponse.data);
        return true;
    } catch (error) {
        console.error("Error testing PDF processing service:", error.message);
        return false;
    }
}
