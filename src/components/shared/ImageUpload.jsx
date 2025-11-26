import React, { useState, useRef } from 'react'
import Button from './Button.jsx'

/**
 * ImageUpload Component
 * 
 * File upload with preview for patient photos
 */
const ImageUpload = ({ value, onChange, label = 'Photo', error, errorMessage }) => {
  const [preview, setPreview] = useState(value || null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, GIF, etc.)')
      return
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      alert('Image size must be less than 2MB. Please choose a smaller image.')
      return
    }

    setIsProcessing(true)

    try {
      // Convert image to base64
      const reader = new FileReader()
      
      reader.onload = (event) => {
        const base64String = event.target.result
        setPreview(base64String)
        onChange(base64String)
        setIsProcessing(false)
      }

      reader.onerror = () => {
        alert('Failed to read image file')
        setIsProcessing(false)
      }

      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Failed to process image')
      setIsProcessing(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-3">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}

      {/* Preview or Upload Area */}
      <div className="flex items-start gap-4">
        {/* Preview */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-neutral-100 border-2 border-neutral-200 flex items-center justify-center">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl text-neutral-400">👤</span>
            )}
          </div>
        </div>

        {/* Upload Controls */}
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="small"
              onClick={handleClick}
              disabled={isProcessing}
            >
              {preview ? '📷 Change Photo' : '📷 Upload Photo'}
            </Button>
            
            {preview && (
              <Button
                type="button"
                variant="danger"
                size="small"
                onClick={handleRemove}
                disabled={isProcessing}
              >
                🗑️ Remove
              </Button>
            )}
          </div>

          <p className="text-xs text-neutral-600">
            JPG, PNG, or GIF. Max size 2MB.
          </p>

          {isProcessing && (
            <p className="text-xs text-primary-600">
              Processing image...
            </p>
          )}

          {error && errorMessage && (
            <p className="text-xs text-danger-600">
              {errorMessage}
            </p>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload image"
      />
    </div>
  )
}

export default ImageUpload
