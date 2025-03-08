'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LatLngTuple } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Dynamically import MapContainer & other components to fix SSR issue
const MapContainer = dynamic(() => import('react-leaflet').then((m) => m.MapContainer), {
  ssr: false,
})
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then((m) => m.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then((m) => m.Popup), { ssr: false })

const Map = () => {
  const router = useRouter()
  const [locations, setLocations] = useState<
    Array<{ lat: number; lng: number; title: string; description: string; slug: string }>
  >([])
  const [loading, setLoading] = useState(true) // Add loading state

  // Load Leaflet only in the browser
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: '/marker-icon-2x.png',
          iconUrl: '/marker-icon.png',
          shadowUrl: '/marker-shadow.png',
        })
      })
    }
  }, [])

  const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  // Fetch location data from the API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/locations`)
        const data = await response.json()
        setLocations(data.docs) // Set locations to data.docs
      } catch (error) {
        console.error('Error fetching locations:', error)
      } finally {
        setLoading(false) // Set loading to false after fetch is complete
      }
    }

    fetchLocations()
  }, [apiUrl])

  // Handle marker click and redirect to location details page
  const handleMarkerClick = (slug: string) => {
    router.push(`/location/${slug}`)
  }

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden">
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <img src="/spinner.gif" alt="Loading..." className="w-16 h-16" />
        </div>
      ) : (
        <MapContainer center={[51.505, -0.09]} zoom={13} className="w-full h-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {locations.map((location) => (
            <Marker
              key={location.slug}
              position={[location.lat, location.lng] as LatLngTuple}
              eventHandlers={{
                click: () => handleMarkerClick(location.slug),
              }}
            >
              <Popup>
                <div>
                  <h3 className="font-bold">{location.title}</h3>
                  <p>{location.description}</p>
                  <Link href={`/location/${location.slug}`} className="text-blue-500">
                    See details
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  )
}

export default Map
