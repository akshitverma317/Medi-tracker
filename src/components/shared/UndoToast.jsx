import React, { useEffect, useState } from 'react'
import Button from './Button.jsx'
import { UNDO_TIMEOUT_SECONDS } from '../../types/constants.js'

/**
 * UndoToast Component
 * 
 * Toast notification with undo functionality (10-second timer)
 */
const UndoToast = ({
  isVisible,
  message,
  onUndo,
  onDismiss,
  timeout = UNDO_TIMEOUT_SECONDS * 1000
}) => {
  const [timeLeft, setTimeLeft] = useState(timeout / 1000)
  
  useEffect(() => {
    if (!isVisible) {
      setTimeLeft(timeout / 1000)
      return
    }
    
    // Countdown timer
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          onDismiss()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [isVisible, timeout, onDismiss])
  
  if (!isVisible) return null
  
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-neutral-800 text-white rounded-lg shadow-lg p-4 flex items-center gap-4 min-w-[320px] max-w-md">
        <div className="flex-1">
          <p className="text-sm">{message}</p>
          <p className="text-xs text-neutral-400 mt-1">
            Auto-dismiss in {timeLeft}s
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="small"
            onClick={() => {
              onUndo()
              onDismiss()
            }}
            className="text-white hover:bg-neutral-700"
          >
            Undo
          </Button>
          
          <button
            onClick={onDismiss}
            className="text-white hover:text-neutral-300 text-xl px-2"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}

export default UndoToast
