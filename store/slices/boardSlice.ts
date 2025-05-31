import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface Board {
    id: string
    user_id: string
    name: string
    description: string
    color: string
    is_default: boolean
    created_at: string
    updated_at: string
}

interface BoardState {
    boards: Board[]
    currentBoard: Board | null // Add current board for single board fetching
    loading: boolean
    error: string | null
    initialized: boolean
}

const initialState: BoardState = {
    boards: [],
    currentBoard: null, // Initialize current board
    loading: false,
    error: null,
    initialized: false,
}

// Fetch boards
export const fetchBoards = createAsyncThunk(
    'board/fetchBoards',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/boards')

            if (!response.ok) {
                const error = await response.json()
                return rejectWithValue(error.message || 'Failed to fetch boards')
            }

            const data = await response.json()

            console.log('Boards API Response:', data) // Debug log

            if (data.boards && Array.isArray(data.boards)) {
                return data.boards
            } else if (Array.isArray(data)) {
                return data
            } else {
                return []
            }
        } catch (error) {
            console.error('Fetch boards error:', error)
            return rejectWithValue('Network error occurred')
        }
    }
)

// Fetch board by ID
export const fetchBoardById = createAsyncThunk(
    'board/fetchBoardById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/boards/${id}`)

            if (!response.ok) {
                const error = await response.json()
                return rejectWithValue(error.message || 'Failed to fetch board')
            }

            const data = await response.json()
            return data.board || data
        } catch (error) {
            console.error('Fetch board by ID error:', error)
            return rejectWithValue('Network error occurred')
        }
    }
)

// Create board
export const createBoard = createAsyncThunk(
    'board/createBoard',
    async (
        { name, description }: { name: string; description?: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await fetch('/api/boards/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    description: description || '',
                    color: 'black' // Set default color to black
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                return rejectWithValue(error.message || 'Failed to create board')
            }

            const data = await response.json()
            return data.board || data
        } catch (error) {
            console.error('Create board error:', error)
            return rejectWithValue('Network error occurred')
        }
    }
)

// Update board
export const updateBoard = createAsyncThunk(
    'board/updateBoard',
    async (
        { id, name, description }: { id: string; name: string; description?: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await fetch(`/api/boards/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    description: description || ''
                }),
            })

            if (!response.ok) {
                const error = await response.json()
                return rejectWithValue(error.message || 'Failed to update board')
            }

            const data = await response.json()
            return data.board || data
        } catch (error) {
            console.error('Update board error:', error)
            return rejectWithValue('Network error occurred')
        }
    }
)

// Delete board
export const deleteBoard = createAsyncThunk(
    'board/deleteBoard',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/boards/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const error = await response.json()
                return rejectWithValue(error.message || 'Failed to delete board')
            }

            return id
        } catch (error) {
            console.error('Delete board error:', error)
            return rejectWithValue('Network error occurred')
        }
    }
)

const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        clearCurrentBoard: (state) => {
            state.currentBoard = null
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch boards
            .addCase(fetchBoards.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchBoards.fulfilled, (state, action) => {
                state.boards = action.payload
                state.loading = false
                state.initialized = true
                state.error = null
                console.log('Boards loaded:', action.payload) // Debug log
            })
            .addCase(fetchBoards.rejected, (state, action) => {
                state.loading = false
                state.initialized = true
                state.error = action.payload as string || 'Failed to fetch boards'
            })

            // Fetch board by ID
            .addCase(fetchBoardById.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchBoardById.fulfilled, (state, action) => {
                state.currentBoard = action.payload
                state.loading = false
                state.error = null

                // Also update the board in the boards array if it exists
                const index = state.boards.findIndex(board => board.id === action.payload.id)
                if (index !== -1) {
                    state.boards[index] = action.payload
                }
            })
            .addCase(fetchBoardById.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string || 'Failed to fetch board'
            })

            // Create board
            .addCase(createBoard.pending, (state) => {
                state.error = null
            })
            .addCase(createBoard.fulfilled, (state, action) => {
                state.boards.unshift(action.payload)
                state.error = null
            })
            .addCase(createBoard.rejected, (state, action) => {
                state.error = action.payload as string || 'Failed to create board'
            })

            // Update board
            .addCase(updateBoard.pending, (state) => {
                state.error = null
            })
            .addCase(updateBoard.fulfilled, (state, action) => {
                const index = state.boards.findIndex(board => board.id === action.payload.id)
                if (index !== -1) {
                    state.boards[index] = action.payload
                }

                // Also update current board if it's the same
                if (state.currentBoard && state.currentBoard.id === action.payload.id) {
                    state.currentBoard = action.payload
                }
                state.error = null
            })
            .addCase(updateBoard.rejected, (state, action) => {
                state.error = action.payload as string || 'Failed to update board'
            })

            // Delete board
            .addCase(deleteBoard.pending, (state) => {
                state.error = null
            })
            .addCase(deleteBoard.fulfilled, (state, action) => {
                state.boards = state.boards.filter(board => board.id !== action.payload)

                // Clear current board if it was deleted
                if (state.currentBoard && state.currentBoard.id === action.payload) {
                    state.currentBoard = null
                }
                state.error = null
            })
            .addCase(deleteBoard.rejected, (state, action) => {
                state.error = action.payload as string || 'Failed to delete board'
            })
    },
})

export const {
    clearError,
    setLoading,
    clearCurrentBoard,
} = boardSlice.actions

export default boardSlice.reducer