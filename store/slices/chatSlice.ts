import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

export interface Message {
    id: string
    message_content: string
    message_type: "user" | "ai"
    message_order: number
    timestamp: Date
    pdfId?: string
    userId?: string
}

export interface ChatState {
    messages: Message[]
    isLoading: boolean
    isTyping: boolean
    error: string | null
    currentPdfId: string | null
}

const initialState: ChatState = {
    messages: [],
    isLoading: false,
    isTyping: false,
    error: null,
    currentPdfId: null,
}

// Async thunk for fetching messages from Supabase
export const fetchMessages = createAsyncThunk("chat/fetchMessages", async (pdfId: string, { rejectWithValue }) => {
    try {
        const response = await fetch(`/api/messages?pdfId=${pdfId}`)
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "Failed to fetch messages")
        }
        const data = await response.json()
        return data.messages
    } catch (error) {
        return rejectWithValue(error instanceof Error ? error.message : "Unknown error")
    }
})

// Async thunk for sending message and getting AI response
export const sendMessage = createAsyncThunk(
    "chat/sendMessage",
    async ({ content, pdfId }: { content: string; pdfId: string }, { rejectWithValue }) => {
        try {
            const response = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message_content: content, pdf_id: pdfId }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                // Return the specific error message from the backend
                throw new Error(errorData.error || "Failed to send message")
            }

            const data = await response.json()
            return {
                userMessage: data.userMessage,
                aiMessage: data.aiMessage,
            }
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "Unknown error")
        }
    },
)

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setCurrentPdf: (state, action: PayloadAction<string>) => {
            state.currentPdfId = action.payload
            state.messages = [] // Clear messages when switching PDFs
        },
        clearMessages: (state) => {
            state.messages = []
        },
        setTyping: (state, action: PayloadAction<boolean>) => {
            state.isTyping = action.payload
        },
        clearError: (state) => {
            state.error = null
        },
        // Add user message immediately when sending
        addUserMessage: (state, action: PayloadAction<Message>) => {
            state.messages.push(action.payload)
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch messages
            .addCase(fetchMessages.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.isLoading = false
                state.messages = action.payload
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            // Send message
            .addCase(sendMessage.pending, (state) => {
                state.isTyping = true
                state.error = null
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.isTyping = false
                // Only add the AI message since user message was already added
                state.messages.push(action.payload.aiMessage)
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.isTyping = false
                state.error = action.payload as string
            })
    },
})

export const { setCurrentPdf, clearMessages, setTyping, clearError, addUserMessage } = chatSlice.actions
export default chatSlice.reducer