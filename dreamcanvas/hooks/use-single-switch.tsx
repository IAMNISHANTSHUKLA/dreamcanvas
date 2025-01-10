'use client'

import { useEffect, useCallback } from 'react'

export function useSingleSwitch() {
  const registerSwitchAction = useCallback((actionName: string, action: () => void) => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        action()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  return { registerSwitchAction }
}

