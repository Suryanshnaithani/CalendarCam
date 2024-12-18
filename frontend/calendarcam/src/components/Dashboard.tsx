import { useState, useEffect } from 'react'
import MonthSelector from './MonthSelector'
import EventSummary from './EventSummary'
import EventList from './EventList'
import PhotoList from './PhotoList'
import AutoTagContainer from './AutoTagContainer'
import SelectedItems from './SelectedItems'

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [events, setEvents] = useState([])
  const [photos, setPhotos] = useState([])
  const [eventSummary, setEventSummary] = useState('')
  const [activeTab, setActiveTab] = useState('events')

  useEffect(() => {
    fetchEventsAndPhotos()
  }, [selectedMonth])

  const fetchEventsAndPhotos = async () => {
    try {
      const response = await fetch(`/api/calendar_events?month=${selectedMonth}`)
      const data = await response.json()
      setEvents(data.events)
      setPhotos(data.photos)
      setEventSummary(data.event_summary)
    } catch (error) {
      console.error('Error fetching events and photos:', error)
    }
  }

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month)
  }

  const handleRegenerateSummary = async () => {
    try {
      const response = await fetch(`/api/regenerate_summary?month=${selectedMonth}`, {
        method: 'POST',
      })
      const data = await response.json()
      setEventSummary(data.summary)
    } catch (error) {
      console.error('Error regenerating summary:', error)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Your Dashboard</h2>
      <MonthSelector selectedMonth={selectedMonth} onMonthChange={handleMonthChange} />
      <EventSummary summary={eventSummary} onRegenerate={handleRegenerateSummary} />
      <div className="flex space-x-4 border-b">
        {['events', 'photos', 'auto-tag'].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 font-medium ${
              activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div>
        {activeTab === 'events' && <EventList events={events} />}
        {activeTab === 'photos' && <PhotoList photos={photos} />}
        {activeTab === 'auto-tag' && <AutoTagContainer events={events} photos={photos} />}
      </div>
      <SelectedItems />
      <div className="flex space-x-4">
        <button
          onClick={() => console.log('Save Tagged Photos')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Save Tagged Photos
        </button>
        <button
          onClick={() => console.log('Save Auto Tagged Photos')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Save Auto Tagged Photos
        </button>
      </div>
    </div>
  )
}

export default Dashboard

