'use client'

import MetallicPaint, { parseLogoImage } from '@/components/MetallicPaint'
import { useEffect, useState } from 'react'

import logo from '@/../public/svg/Logo.svg'

const Logo = () => {
  const [imageData, setImageData] = useState<ImageData | null>(null)
  const [canRender, setCanRender] = useState(false)

  useEffect(() => {
    async function loadDefaultImage() {
      try {
        const response = await fetch(logo.src)
        const blob = await response.blob()
        const file = new File([blob], 'default.png', { type: blob.type })

        const parsedData = await parseLogoImage(file)
        setImageData(parsedData?.imageData ?? null)
        setCanRender(true)
      } catch (err) {
        console.error('Error loading default image:', err)
      }
    }

    loadDefaultImage()
  }, [])

  useEffect(() => {
    if (!imageData && typeof window !== 'undefined') {
      setImageData(new ImageData(1, 1))
    }
  }, [])

  return (
    <div
      className={`w-28 h-28 transition duration-500 ${canRender ? 'opacity-80' : 'opacity-0'}`}
    >
      {imageData && imageData.data && (
        <MetallicPaint
          imageData={imageData}
          params={{
            edge: 0.2,
            patternBlur: 0.005,
            patternScale: 5,
            refraction: 0.02,
            speed: 0.1,
            liquid: 1,
          }}
        />
      )}
    </div>
  )
}

Logo.displayName = 'Logo'

export { Logo }
