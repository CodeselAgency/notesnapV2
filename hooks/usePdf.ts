import { useAppSelector, useAppDispatch } from './store'
import {
    fetchPdfs,
    fetchPdfById,
    uploadPdf,
    clearError,
    clearCurrentPdf,
    fetchPdfsByBoardId
} from '@/store/slices/pdfSlice'
import { useCallback } from 'react'

export function usePdf() {
    const dispatch = useAppDispatch()
    const {
        files,
        currentPdf,
        uploads,
        loading,
        loadingPdf,
        error,
        initialized
    } = useAppSelector((state) => state.pdf)

    const loadPdfs = useCallback(() => {
        return dispatch(fetchPdfs())
    }, [dispatch])

    const loadPdfById = useCallback((id: string) => {
        return dispatch(fetchPdfById(id))
    }, [dispatch])

    const loadPdfsByBoardId = useCallback((boardId: string) => {
        return dispatch(fetchPdfsByBoardId(boardId))
    }, [dispatch])

    const uploadFile = useCallback((file: File, boardId?: string, onProgress?: (progress: number) => void) => {
        return dispatch(uploadPdf({ file, boardId, onProgress }))
    }, [dispatch])

    const clearPdfError = useCallback(() => {
        dispatch(clearError())
    }, [dispatch])

    const clearCurrentPdfData = useCallback(() => {
        dispatch(clearCurrentPdf())
    }, [dispatch])

    return {
        // Data
        files,
        currentPdf,
        uploads,

        // Loading states
        loading,
        loadingPdf,
        error,
        initialized,

        // Actions
        loadPdfs,
        loadPdfById,
        loadPdfsByBoardId,
        uploadFile,
        clearError: clearPdfError,
        clearCurrentPdf: clearCurrentPdfData,
    }
}