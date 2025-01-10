import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Navigation() {
  return (
    <nav className="bg-purple-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          DreamCanvas
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/gallery" passHref>
              <Button variant="ghost">Gallery</Button>
            </Link>
          </li>
          <li>
            <Link href="/profile" passHref>
              <Button variant="ghost">Profile</Button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

