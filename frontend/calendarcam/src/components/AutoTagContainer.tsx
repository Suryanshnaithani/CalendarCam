import { useState } from 'react'

interface Event {
  id: string
  summary: string
  parsed_date: string
}

interface Photo {
  id: string
  baseUrl: string
  parsed_date: string
}

interface AutoTagContainerProps {
  events: Event[]
  photos: Photo[]
}

const AutoTagContainer = ({ events, photos }: AutoTagContainerProps) => {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])

  const toggleGroupSelection = (eventId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    )
  }

  const getMatchingPhotos = (eventDate: string) => {
    return photos.filter((photo) => photo.parsed_date === eventDate)
  }

  return (
    <div className="space-y-6">
      {events.map((event) => {
        const matchingPhotos = getMatchingPhotos(event.parsed_date)
        if (matchingPhotos.length === 0) return null

        return (
          <div key={event.id} className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`auto-event-${event.id}`}
                checked={selectedGroups.includes(event.id)}
                onChange={() => toggleGroupSelection(event.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor={`auto-event-${event.id}`}
                className="text-sm font-medium text-gray-700"
              >
                {event.summary} - {event.parsed_date}
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {matchingPhotos.map((photo) => (
                <div key={photo.id} className="aspect-w-1 aspect-h-1">
                  <img
                    src={photo.baseUrl}
                    alt={`Photo from ${photo.parsed_date}`}
                    className="object-cover w-full h-full rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default AutoTagContainer

