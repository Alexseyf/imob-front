"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface CarouselProps {
  images: {
    src: string
    alt: string
  }[]
  interval?: number
}

export default function Carousel({ images, interval = 3000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval])

  return (
    <div className="relative w-full max-w-5xl mx-auto h-[400px] overflow-hidden rounded-lg">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image.src || "/placeholder.svg"}
            alt={image.alt}
            fill
            className="object-cover"
            priority={index === 0}
          />
          {/* <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded text-sm">{image.text}</div> */}
        </div>
      ))}
    </div>
  )
}

