import { useState } from 'react'

interface Photo {
  id: string
  baseUrl: string
  parsed_date: string
}

interface PhotoListProps {
  photos: Photo[]
}

const PhotoList = ({ photos }: PhotoListProps) => {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])

  const togglePhotoSelection = (id: string) => {
    setSelectedPhotos((prev) =>
      prev.includes(id) ? prev.filter((photoId) => photoId !== id) : [...prev, id]
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
            selectedPhotos.includes(photo.id) ? 'border-blue-600' : 'border-transparent'
          }`}
          onClick={() => togglePhotoSelection(photo.id)}
        >
          <div className="aspect-w-1 aspect-h-1">
            <img
              src={photo.baseUrl}
              alt={`Photo from ${photo.parsed_date}`}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default PhotoList

