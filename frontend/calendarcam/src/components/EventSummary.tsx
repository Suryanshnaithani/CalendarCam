interface EventSummaryProps {
  summary: string
  onRegenerate: () => void
}

const EventSummary = ({ summary, onRegenerate }: EventSummaryProps) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-2">Month Summary</h3>
      <p className="text-gray-600 mb-4">{summary}</p>
      <button
        onClick={onRegenerate}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
      >
        Regenerate Summary
      </button>
    </div>
  )
}

export default EventSummary

