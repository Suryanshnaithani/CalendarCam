interface Event {
  id: string
  summary: string
  parsed_date: string
}

interface EventListProps {
  events: Event[]
}

const EventList = ({ events }: EventListProps) => {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`event-${event.id}`}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor={`event-${event.id}`}
            className="text-sm font-medium text-gray-700"
          >
            {event.summary} - {event.parsed_date}
          </label>
        </div>
      ))}
    </div>
  )
}

export default EventList

