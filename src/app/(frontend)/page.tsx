import Map from '@/components/Map'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Map</h1>
      <Map />
    </main>
  )
}
