import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface PdfFile {
    id: string
    user_id: string
    board_id: string | null
    file_name: string
    file_size: number
    file_url: string
    extracted_content: string
    page_count: number
    summary: string
    flashcards: any[]
    notes: string
    quiz: any[]
    processing_status: string
    created_at: string
    updated_at: string
}

interface UploadProgress {
    fileId: string
    progress: number
    status: 'uploading' | 'processing' | 'completed' | 'error'
    documentId?: string
    error?: string
}

interface PdfState {
    files: PdfFile[]
    currentPdf: PdfFile | null
    uploads: UploadProgress[]
    loading: boolean
    loadingPdf: boolean
    error: string | null
    initialized: boolean
}

const initialState: PdfState = {
    files: [],
    currentPdf: null,
    uploads: [],
    loading: false,
    loadingPdf: false,
    error: null,
    initialized: false,
}

// Fetch PDFs
export const fetchPdfs = createAsyncThunk(
    'pdf/fetchPdfs',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/pdfs')

            if (!response.ok) {
                let errorMessage = 'Failed to fetch PDFs';
                try {
                    const error = await response.json()
                    errorMessage = error.message || errorMessage;
                } catch {
                    // If JSON parsing fails, use status text
                    errorMessage = response.statusText || errorMessage;
                }
                return rejectWithValue(errorMessage)
            }

            const data = await response.json()

            // Handle response with pdfs property
            console.log('API Response:', data)

            if (data.pdfs && Array.isArray(data.pdfs)) {
                return data.pdfs
            } else if (Array.isArray(data)) {
                return data
            } else if (data.files && Array.isArray(data.files)) {
                return data.files
            } else if (data.data && Array.isArray(data.data)) {
                return data.data
            } else {
                return []
            }
        } catch (error) {
            console.error('Fetch error:', error)
            return rejectWithValue('Network error occurred')
        }
    }
)

// Fetch PDFs by Board ID
export const fetchPdfsByBoardId = createAsyncThunk(
    'pdf/fetchPdfsByBoardId',
    async (boardId: string, { rejectWithValue }) => {
        try {
            console.log('Fetching PDFs by Board ID:', boardId)
            const id = boardId
            const response = await fetch(`/api/pdfs/boardsId/${id}`)

            if (!response.ok) {
                let errorMessage = 'Failed to fetch PDFs by Board ID';
                try {
                    const error = await response.json()
                    errorMessage = error.message || errorMessage;
                } catch {
                    // If JSON parsing fails, use status text
                    errorMessage = response.statusText || errorMessage;
                }
                return rejectWithValue(errorMessage)
            }

            const data = await response.json()

            // Always return an array
            if (Array.isArray(data)) {
                return data
            } else if (data.pdfs && Array.isArray(data.pdfs)) {
                return data.pdfs
            } else if (data.files && Array.isArray(data.files)) {
                return data.files
            } else {
                return []
            }
        } catch (error) {
            console.error('Fetch error:', error)
            return rejectWithValue('Network error occurred')
        }
    }
)

// Fetch PDF by ID
export const fetchPdfById = createAsyncThunk(
    'pdf/fetchPdfById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/pdfs/${id}`)

            if (!response.ok) {
                if (response.status === 404) {
                    return rejectWithValue('PDF not found')
                }
                let errorMessage = 'Failed to fetch PDF';
                try {
                    const error = await response.json()
                    errorMessage = error.message || errorMessage;
                } catch {
                    errorMessage = response.statusText || errorMessage;
                }
                return rejectWithValue(errorMessage)
            }

            const data = await response.json()

            // Handle different response structures
            if (data.pdf) {
                return data.pdf
            } else if (data.file) {
                return data.file
            } else if (data.data) {
                return data.data
            } else {
                return data
            }
        } catch (error) {
            console.error('Fetch PDF by ID error:', error)
            return rejectWithValue('Network error occurred')
        }
    }
)

// Upload PDF with board ID
export const uploadPdf = createAsyncThunk(
    "pdf/uploadPdf",
    async (
        { file, boardId, onProgress }: { file: File; boardId?: string; onProgress?: (progress: number) => void },
        { dispatch, rejectWithValue },
    ) => {
        try {
            // Validate file
            if (!file.type.includes("pdf")) {
                return rejectWithValue("Only PDF files are allowed")
            }

            if (file.size > 10 * 1024 * 1024) {
                // 10MB limit
                return rejectWithValue("File size must be less than 10MB")
            }

            const fileId = `${Date.now()}-${file.name}`

            // Add upload progress tracking
            dispatch(
                addUploadProgress({
                    fileId,
                    progress: 0,
                    status: "uploading",
                }),
            )

            const formData = new FormData()
            formData.append("file", file)
            formData.append("fileId", fileId)
            if (boardId) {
                formData.append("boardId", boardId)
            }

            const response = await fetch("/api/pdfs/upload", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                let errorMessage = "Upload failed. Please try again."

                try {
                    const errorData = await response.json()
                    errorMessage = errorData.message || errorData.error || errorMessage
                } catch {
                    // If response is not JSON, use status-based messages
                    if (response.status === 413) {
                        errorMessage = "File size exceeds the limit. Please try a smaller PDF."
                    } else if (response.status === 429) {
                        errorMessage =
                            "You have reached your limit of PDFs for your tier. Please upgrade to a higher tier to upload more PDFs."
                    } else if (response.status === 400) {
                        errorMessage = "Invalid file format. Please upload a valid PDF file."
                    } else if (response.status >= 500) {
                        errorMessage = "Server error occurred. Please try again later."
                    } else {
                        errorMessage = response.statusText || errorMessage
                    }
                }

                dispatch(
                    updateUploadProgress({
                        fileId,
                        progress: 0,
                        status: "error",
                    }),
                )

                return rejectWithValue(errorMessage)
            }

            const data = await response.json()

            // Update progress to completed
            dispatch(
                updateUploadProgress({
                    fileId,
                    progress: 100,
                    status: "completed",
                }),
            )

            // Remove upload progress after 2 seconds
            setTimeout(() => {
                dispatch(removeUploadProgress(fileId))
            }, 2000)

            // Handle different response structures for uploaded file
            return data.file || data
        } catch (error) {
            console.error("Upload error:", error)

            // Handle network errors and other exceptions
            let errorMessage = "Network error occurred. Please check your connection and try again."

            if (error instanceof Error) {
                if (error.message.includes("Failed to fetch")) {
                    errorMessage = "Network error. Please check your internet connection."
                } else if (error.message.includes("timeout")) {
                    errorMessage = "Upload timeout. Please try again with a smaller file."
                } else {
                    errorMessage = error.message
                }
            }

            return rejectWithValue(errorMessage)
        }
    },
)

const pdfSlice = createSlice({
    name: 'pdf',
    initialState,
    reducers: {
        addUploadProgress: (state, action: PayloadAction<UploadProgress>) => {
            state.uploads.push(action.payload)
        },
        updateUploadProgress: (state, action: PayloadAction<UploadProgress>) => {
            const index = state.uploads.findIndex(
                upload => upload.fileId === action.payload.fileId
            )
            if (index !== -1) {
                state.uploads[index] = action.payload
            }
        },
        removeUploadProgress: (state, action: PayloadAction<string>) => {
            state.uploads = state.uploads.filter(
                upload => upload.fileId !== action.payload
            )
        },
        clearError: (state) => {
            state.error = null
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        clearCurrentPdf: (state) => {
            state.currentPdf = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch PDFs
            .addCase(fetchPdfs.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchPdfs.fulfilled, (state, action) => {
                state.files = action.payload
                state.loading = false
                state.initialized = true
                state.error = null
                console.log('Files loaded:', action.payload)
            })
            .addCase(fetchPdfs.rejected, (state, action) => {
                state.loading = false
                state.initialized = true
                state.error = action.payload as string || 'Failed to fetch PDFs'
            })

            // Fetch PDF by ID
            .addCase(fetchPdfById.pending, (state) => {
                state.loadingPdf = true
                state.error = null
            })
            .addCase(fetchPdfById.fulfilled, (state, action) => {
                state.currentPdf = action.payload
                state.loadingPdf = false
                state.error = null
                console.log('PDF loaded by ID:', action.payload)
            })
            .addCase(fetchPdfById.rejected, (state, action) => {
                state.loadingPdf = false
                state.currentPdf = null
                state.error = action.payload as string || 'Failed to fetch PDF'
            })

            // Fetch PDFs by Board ID
            .addCase(fetchPdfsByBoardId.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchPdfsByBoardId.fulfilled, (state, action) => {
                state.files = action.payload
                state.loading = false
                state.error = null
                console.log('PDFs loaded by Board ID:', action.payload)
            })
            .addCase(fetchPdfsByBoardId.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string || 'Failed to fetch PDFs by Board ID'
            })
            // Upload PDF
            .addCase(uploadPdf.pending, (state) => {
                state.error = null
            })
            .addCase(uploadPdf.fulfilled, (state, action) => {
                state.files.unshift(action.payload)
                state.error = null
            })
            .addCase(uploadPdf.rejected, (state, action) => {
                state.error = action.payload as string || 'Failed to upload PDF'
            })
    },
})

export const {
    addUploadProgress,
    updateUploadProgress,
    removeUploadProgress,
    clearError,
    setLoading,
    clearCurrentPdf,
} = pdfSlice.actions

export default pdfSlice.reducer