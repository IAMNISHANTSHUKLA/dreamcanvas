'use client'

import { useState, useEffect } from 'react'
import annyang from 'annyang'

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('')

  useEffect(() => {
    if (annyang) {
      annyang.addCallback('result', (phrases: string[]) => {
        setTranscript(phrases[0])
      })
    }
    return () => {
      if (annyang) {
        annyang.removeCallback('result')
      }
    }
  }, [])

  const startListening = () => {
    if (annyang) {
      annyang.start()
    }
  }

  const stopListening = () => {
    if (annyang) {
      annyang.abort()
    }
  }

  return { startListening, stopListening, transcript }
}

