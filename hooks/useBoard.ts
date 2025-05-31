import { useAppSelector, useAppDispatch } from './store'
import {
    fetchBoards,
    fetchBoardById,
    createBoard,
    updateBoard,
    deleteBoard,
    clearError,
    clearCurrentBoard
} from '@/store/slices/boardSlice'
import { useCallback } from 'react'

export function useBoard() {
    const dispatch = useAppDispatch()
    const { boards, currentBoard, loading, error, initialized } = useAppSelector((state) => state.board)

    const loadBoards = useCallback(() => {
        return dispatch(fetchBoards())
    }, [dispatch])

    const loadBoardById = useCallback((id: string) => {
        return dispatch(fetchBoardById(id))
    }, [dispatch])

    const createNewBoard = useCallback((name: string, description?: string) => {
        return dispatch(createBoard({ name, description }))
    }, [dispatch])

    const updateExistingBoard = useCallback((id: string, name: string, description?: string) => {
        return dispatch(updateBoard({ id, name, description }))
    }, [dispatch])

    const deleteExistingBoard = useCallback((id: string) => {
        return dispatch(deleteBoard(id))
    }, [dispatch])

    const clearBoardError = useCallback(() => {
        dispatch(clearError())
    }, [dispatch])

    const clearCurrentBoardData = useCallback(() => {
        dispatch(clearCurrentBoard())
    }, [dispatch])

    // Helper function to get board by ID from the boards array
    const getBoardById = useCallback((id: string) => {
        return boards.find(board => board.id === id) || null
    }, [boards])

    return {
        boards,
        currentBoard,
        loading,
        error,
        initialized,
        loadBoards,
        loadBoardById,
        createBoard: createNewBoard,
        updateBoard: updateExistingBoard,
        deleteBoard: deleteExistingBoard,
        clearError: clearBoardError,
        clearCurrentBoard: clearCurrentBoardData,
        getBoardById,
    }
}