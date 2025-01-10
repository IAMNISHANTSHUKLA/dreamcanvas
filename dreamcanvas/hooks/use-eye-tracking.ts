'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

interface EyePosition {
  x: number
  y: number
}

interface WebGazerInstance {
  setGazeListener: (callback: (data: any) => void) => any
  begin: () => Promise<any>
  end: () => void
  clearData: () => Promise<void>
  params: {
    showVideo: boolean
    showFaceOverlay: boolean
    showFaceFeedback: boolean
    showPredictionPoints: boolean
  }
}

export function useEyeTracking() {
  const [eyePosition, setEyePosition] = useState<EyePosition | null>(null)
  const [isCalibrated, setIsCalibrated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const webgazerRef = useRef<any>(null)
  const gazeListenerRef = useRef<((data: any) => void) | null>(null)

  const checkBrowserCompatibility = useCallback(() => {
    if (typeof window === 'undefined') {
      throw new Error('Eye tracking is not available on the server side')
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Your browser does not support webcam access')
    }

    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      throw new Error('Eye tracking requires a secure context (HTTPS)')
    }
  }, [])

  const requestPermissions = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach(track => track.stop())
    } catch (err) {
      throw new Error('Camera permission denied')
    }
  }, [])

  const initializeWebGazer = useCallback(async (retryCount = 0) => {
    try {
      setIsLoading(true)
      setError(null)

      checkBrowserCompatibility()
      await requestPermissions()

      try {
        const WebGazer = (await import('webgazer')).default

        webgazerRef.current = WebGazer

        gazeListenerRef.current = (data: any) => {
          if (data == null) return
          setEyePosition({ x: data.x, y: data.y })
        }

        await webgazerRef.current.begin()

        webgazerRef.current.params.showVideo = false
        webgazerRef.current.params.showFaceOverlay = false
        webgazerRef.current.params.showFaceFeedback = false
        webgazerRef.current.params.showPredictionPoints = false

        webgazerRef.current.setGazeListener(gazeListenerRef.current)

        await new Promise((resolve) => setTimeout(resolve, 3000))

        setIsCalibrated(true)
        setIsLoading(false)

      } catch (err) {
        throw new Error('Failed to load WebGazer library')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Eye tracking initialization error:', errorMessage)

      if (retryCount < 2 && errorMessage.includes('Failed to load')) {
        console.log(`Retrying initialization (attempt ${retryCount + 1})...`)
        setTimeout(() => initializeWebGazer(retryCount + 1), 1000)
        return
      }

      setError(errorMessage)
      setIsLoading(false)
    }
  }, [checkBrowserCompatibility, requestPermissions])

  const cleanup = useCallback(() => {
    if (webgazerRef.current) {
      try {
        webgazerRef.current.end()
        webgazerRef.current = null
        gazeListenerRef.current = null
        setEyePosition(null)
        setIsCalibrated(false)
      } catch (err) {
        console.error('Cleanup error:', err)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeWebGazer()
    }
    return cleanup
  }, [initializeWebGazer, cleanup])

  const calibrateEyeTracking = async () => {
    if (!webgazerRef.current) {
      setError('WebGazer not initialized')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      await webgazerRef.current.clearData()
      console.log('WebGazer calibration data cleared')

      setIsCalibrated(false)
      cleanup()
      await initializeWebGazer()

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Calibration failed'
      console.error('Calibration error:', errorMessage)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cleanup()
      } else {
        initializeWebGazer()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [cleanup, initializeWebGazer])

  return {
    eyePosition,
    isCalibrated,
    isLoading,
    error,
    calibrateEyeTracking,
  }
}

export function MyComponent() {
  const { eyePosition, isCalibrated, isLoading, error, calibrateEyeTracking } = useEyeTracking()

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div>
      <p>Status: {isLoading ? 'Loading...' : (isCalibrated ? 'Ready' : 'Not calibrated')}</p>
      {eyePosition && (
        <p>
          Looking at: X: {Math.round(eyePosition.x)}, Y: {Math.round(eyePosition.y)}
        </p>
      )}
      <button onClick={calibrateEyeTracking}>Recalibrate</button>
    </div>
  )
}

