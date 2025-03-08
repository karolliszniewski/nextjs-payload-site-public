'use client'

import { useEffect, useState } from 'react'

interface Location {
  title: string
  description: string
  lat: number
  lng: number
  slug: string
}

export default function LocationDetails({ params }: { params: Promise<{ slug: string }> }) {
  const [location, setLocation] = useState<Location | null>(null)
  const [slug, setSlug] = useState<string | null>(null)

  useEffect(() => {
    const fetchLocations = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001'

      try {
        const { slug } = await params
        setSlug(slug)

        // Fetch all locations
        const response = await fetch(`${apiUrl}/api/locations`)
        const data = await response.json()

        if (data?.docs && Array.isArray(data.docs)) {
          const foundLocation = data.docs.find((loc: Location) => loc.slug === slug)
          if (foundLocation) {
            setLocation(foundLocation)
          } else {
            console.error('Location not found')
          }
        } else {
          console.error('Expected an array of locations in "docs", but received:', data)
        }
      } catch (error) {
        console.error('Error fetching locations:', error)
      }
    }

    fetchLocations()
  }, [params])

  if (!location) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-800 text-white">
        <p className="text-xl">Location not found</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen py-8 px-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{location.title}</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{location.description}</p>

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          <p>
            <span className="font-medium text-gray-900 dark:text-white">Lat:</span> {location.lat}
          </p>
          <p>
            <span className="font-medium text-gray-900 dark:text-white">Lng:</span> {location.lng}
          </p>
        </div>

        <div className="flex justify-between items-center mt-6">
          <a
            href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-500 transition-colors"
          >
            View on map
          </a>
        </div>
      </div>
    </div>
  )
}
