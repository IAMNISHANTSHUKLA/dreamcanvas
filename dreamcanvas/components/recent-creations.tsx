export function RecentCreations() {
    const recentArtworks = [
      { id: '1', imageUrl: '/placeholder.svg?height=200&width=300', prompt: 'A serene landscape' },
      { id: '2', imageUrl: '/placeholder.svg?height=200&width=300', prompt: 'Abstract emotions' },
      { id: '3', imageUrl: '/placeholder.svg?height=200&width=300', prompt: 'Futuristic cityscape' },
      { id: '4', imageUrl: '/placeholder.svg?height=200&width=300', prompt: 'Underwater world' },
    ]
  
    return (
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-purple-600">Recent Creations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recentArtworks.map((artwork) => (
            <div key={artwork.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={artwork.imageUrl} alt={artwork.prompt} className="w-full h-48 object-cover" />
              <div className="p-4">
                <p className="text-sm text-gray-600 truncate">{artwork.prompt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  