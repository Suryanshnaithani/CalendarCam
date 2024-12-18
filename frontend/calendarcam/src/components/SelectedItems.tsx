interface SelectedItemsProps {
  selectedEvents: string[]
  selectedPhotos: string[]
}

const SelectedItems = ({ selectedEvents, selectedPhotos }: SelectedItemsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Selected Items</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Selected Events</h4>
          <div className="max-h-[200px] overflow-y-auto">
            <ul className="space-y-2">
              {selectedEvents.map((event) => (
                <li key={event} className="text-sm text-gray-600">
                  {event}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Selected Photos</h4>
          <div className="max-h-[200px] overflow-y-auto">
            <div className="grid grid-cols-3 gap-2">
              {selectedPhotos.map((photo) => (
                <div key={photo} className="aspect-w-1 aspect-h-1">
                  <img src={photo} alt="Selected photo" className="object-cover w-full h-full rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default SelectedItems

