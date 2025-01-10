import { Canvas } from '@/components/canvas'
import { AccessibilityControls } from '@/components/accessibility-controls'
import { RecentCreations } from '@/components/recent-creations'
import MovementTrackingDemo from '@/components/movement-tracking-demo'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-5xl font-bold text-center mb-8 text-purple-600">Welcome to DreamCanvas</h1>
      <p className="text-xl text-center mb-12 text-gray-600">Unleash your creativity with AI-powered art!</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Canvas />
        </div>
        <div>
          <AccessibilityControls />
        </div>
      </div>
      <RecentCreations />
      <div className="mt-12">
        <MovementTrackingDemo />
      </div>
    </div>
  )
}

