'use client'

import { useState, useEffect } from 'react'
import { useEyeTracking } from '@/hooks/use-eye-tracking'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { EyeTrackingComponent } from './eye-tracking-component'

export function AccessibilityControls() {
  const { } = useEyeTracking()
  const [isEyeTrackingEnabled, setIsEyeTrackingEnabled] = useState(false)
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false)
  const [isSingleSwitchEnabled, setIsSingleSwitchEnabled] = useState(false)

  const handleSingleSwitch = () => {
    console.log('Single switch activated')
    // Add your single switch logic here
  }

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' && isSingleSwitchEnabled) {
        handleSingleSwitch()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [isSingleSwitchEnabled])

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-3xl font-bold mb-6 text-purple-600">Accessibility Controls</h2>
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="eye-tracking" className="text-lg font-semibold">Eye Tracking</Label>
            <Switch
              id="eye-tracking"
              checked={isEyeTrackingEnabled}
              onCheckedChange={setIsEyeTrackingEnabled}
            />
          </div>
          {isEyeTrackingEnabled && (
            <EyeTrackingComponent />
          )}
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="voice-commands" className="text-lg font-semibold">Voice Commands</Label>
            <Switch
              id="voice-commands"
              checked={isVoiceEnabled}
              onCheckedChange={setIsVoiceEnabled}
            />
          </div>
          {isVoiceEnabled && (
            <p className="text-sm text-gray-600">Voice commands are enabled. Speak to interact.</p>
          )}
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="single-switch" className="text-lg font-semibold">Single Switch</Label>
            <Switch
              id="single-switch"
              checked={isSingleSwitchEnabled}
              onCheckedChange={setIsSingleSwitchEnabled}
            />
          </div>
          {isSingleSwitchEnabled && (
            <p className="text-sm text-gray-600">Press the spacebar to activate the single switch</p>
          )}
        </div>
      </div>
    </div>
  )
}

