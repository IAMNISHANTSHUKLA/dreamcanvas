'use client'

import { useEyeTracking } from '@/hooks/use-eye-tracking'
import { Button } from '@/components/ui/button'

export function EyeTrackingComponent() {
  const { eyePosition, isCalibrated, isLoading, error, calibrateEyeTracking } = useEyeTracking()

  // Show error messages with retry option
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
        <Button onClick={() => calibrateEyeTracking()} className="mt-2">
          Retry
        </Button>
      </div>
    )
  }

  // Show loading state
  if (isLoading) {
    return <div className="text-gray-600">Initializing eye tracking...</div>
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600">
        Eye Position: {eyePosition ? `X: ${eyePosition.x.toFixed(2)}, Y: ${eyePosition.y.toFixed(2)}` : 'Not tracking'}
      </p>
      <p className="text-sm text-gray-600">
        Calibrated: {isCalibrated ? 'Yes' : 'No'}
      </p>
      <Button onClick={calibrateEyeTracking} disabled={isLoading} variant="outline" className="w-full">
        Recalibrate
      </Button>
    </div>
  )
}

