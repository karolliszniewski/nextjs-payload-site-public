# NextJS Payload Site

## Live Preview

🌐 [View Demo](https://nextjs-payload-site-karolliszniewskis-projects.vercel.app)

## Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/karolliszniewski/nextjs-payload-site-public.git
```

### 2. Navigate to Project Directory

Navigate to Project Directory

```bash
cd nextjs-payload-site
```

### 3. Install Dependencies

```bash
npm i
```

### 4. Copy .env File
Copy the previously provided .env file into the project directory, or create a new one based on the .env.example file.

### Run Development Server

```
npm run dev
```

### View Local Project

Once the development server is running, open your browser and visit:
🌐 [http://localhost:3000](http://localhost:3000)

#### This project was initially created using the following command:

```bash
npx create-payload-app
```

#Assessment: Building a Location-Based Navigation and Map

1. [Navigation Links](#1-navigation-links)
2. [Contact Page](#2-contact-page)
3. [Registering the Collection](#3-registering-the-collection)
4. [Locations Collection](#4-locations-collection)
5. [Map Component](#5-map-component)
6. [Displaying the Map](#6-displaying-the-map)
7. [Fetching Location Data](#7-fetching-location-data)

#### 1. Navigation Links

`src/Header/Nav/index.tsx`

The base URL is read from the `.env` file to ensure flexibility in different environments.

```ts
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || ''
```

Two navigation links are added dynamically using the `BASE_URL`, making navigation to the homepage and contact page easier.

```tsx
 <Link href={`${BASE_URL}/`} className="text-primary">
        Homepage
      </Link>
      <Link href={`${BASE_URL}/contact`} className="text-primary">
        Contact
      </Link>
```

#### 2. Contact Page

`src/app/(frontend)/contact/page.tsx`

![image](https://github.com/user-attachments/assets/5290f314-c13b-4f8f-abc5-97201916abb4)

![image](https://github.com/user-attachments/assets/ef78a9f1-760a-4d1a-b60c-56e9a6702156)

![image](https://github.com/user-attachments/assets/3775790a-7237-4a01-aa5a-6edf00a0e59d)

A simple form is created with basic validation using HTML attributes (`required`).

```tsx
 <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
```

A submit handler prevents the default form submission behavior and logs the form data to the console.

```tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  console.log(formData)
}
```

#### 3. Registering the Collection

`src/payload.config.ts`

```ts
collections: [Pages, Posts, Media, Categories, Users, Locations],
```

The `Locations` collection is added to the list of registered collections in the Payload CMS configuration.
Once added, Payload CMS automatically updates TypeScript types in `src/payload-types.ts`.

#### 4. Locations Collection

`src/collections/Locations.ts`
A `Locations` collection is defined, including fields for `title`, `description`, latitude (`lat`), longitude (`lng`), and a unique `slug`.
CRUD access permissions are set to allow any user to create, read, update, or delete locations.

```ts
import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'

export const Locations: CollectionConfig = {
  slug: 'locations',

  access: {
    create: anyone,

    delete: anyone,

    read: anyone,

    update: anyone,
  },

  admin: {
    useAsTitle: 'title',
  },

  fields: [
    {
      name: 'title',

      type: 'text',

      required: true,
    },

    {
      name: 'description',

      type: 'textarea',

      required: true,
    },

    {
      name: 'lat',

      type: 'number',

      required: true,
    },

    {
      name: 'lng',

      type: 'number',

      required: true,
    },

    {
      name: 'slug',

      type: 'text',

      required: true,

      unique: true,
    },
  ],
}

export default Locations
```

#### 5. Map Component

`src/components/Map/index.tsx`

- This is the most complex part of the project, as it involves:
  - Fetching location data from an API.
  - Dynamically importing `react-leaflet` components to avoid SSR issues.
  - Displaying location markers on the map.
  - Handling user interactions, such as clicking a marker to navigate to the location’s details page.
- A loading state is managed to improve the user experience while data is being fetched.

<img width="469" alt="image" src="https://github.com/user-attachments/assets/6903e24f-cdf3-4967-94e1-ba52669d182c" />

```tsx
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
```

#### 6. Displaying the Map

`src/app/(frontend)/page.tsx`

The `Map` component is imported and added to the homepage.

```tsx
import Map from '@/components/Map'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Map</h1>
      <Map />
    </main>
  )
}
```

#### 7. Fetching Location Data

`src/app/(frontend)/location/[slug]/page.tsx`

<img width="463" alt="image" src="https://github.com/user-attachments/assets/6f43c13d-eb4f-4d15-a8f6-6b8b2cda4012" />

The application fetches location records from an API endpoint.

```tsx
const response = await fetch(`${apiUrl}/api/locations`)
const data = await response.json()
```

The fetched data is then searched to find a specific location by comparing its `slug` with the current URL parameter.

```tsx
const foundLocation = data.docs.find((loc: Location) => loc.slug === slug)
```







Assesment : 


"Next.js & Payload CMS Mini Project

Overview

The goal of this exercise is to assess your ability to set up a basic Next.js website using Payload CMS as a headless CMS. The project should be structured as a Git repository that I can access, clone, and run locally.

You will create a simple site with:

• A map displaying clickable markers
• A detail page for each marker, managed through Payload CMS
• A basic contact form
• The content is not important, so please use as much placeholder (Lorum Ipsum) text as you'd like.

Requirements

1. Project Setup
• Create a GitHub (or similar) repository and provide access.
• Use Next.js (App Router) and Payload CMS 3.
• Use MongoDB (can be a local instance or a free MongoDB Atlas database).
• Use Tailwind CSS for styling.
• The project should be installable via npm install and runnable via npm run dev.

2. Map with Clickable Markers
• The front page (/) should display a map with a few clickable markers.
• Clicking a marker should navigate to a detail page (/location/[slug]).
• The map component should use React Leaflet (or another suitable mapping library).
• The marker details (title, coordinates, and description) should be stored in Payload CMS.

3. Location Detail Page
• Each location should have a dedicated page (/location/[slug]).
• The data should be dynamically fetched from Payload CMS.
• The content structure in Payload CMS should include at least:
• Title
• Coordinates (lat, lng)
• Description

4. Basic Contact Form
• A separate contact page (/contact) with a form.
• The form should include at least:
• Name (required)
• Email (required & validated)
• Message
• On submit, log the form values to the console (no backend submission needed).

5. Deployment & Instructions
• Provide a clear README with setup and usage instructions.
• Deployment (optional) to Vercel or another platform is a bonus.

What We’re Looking For
• Clean, maintainable code
• Proper use of Next.js App Router and Payload CMS
• UI built with Tailwind CSS
• Functional map with interactive markers
• Clear project structure

How to Submit
• Share the Git repository link.
• Ensure the repo includes all necessary files to run locally.
• Include a README with any important setup steps.

"
