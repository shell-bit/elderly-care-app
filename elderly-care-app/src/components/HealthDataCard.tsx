interface Props {
  label: string
  value: string | number
  unit: string
  icon: string
  status: { label: string; color: string; bg: string }
  subValue?: string
  isLarge?: boolean
}

export default function HealthDataCard({ label, value, unit, icon, status, subValue, isLarge }: Props) {
  return (
    <div
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-1 min-w-0"
      style={{ borderLeft: `4px solid ${status.color}` }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ color: status.color, backgroundColor: status.bg }}
        >
          {status.label}
        </span>
      </div>
      <div className={`font-bold text-gray-800 ${isLarge ? 'text-3xl' : 'text-2xl'}`}>
        {value}
        <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>
      </div>
      {subValue && (
        <div className="text-sm text-gray-400">{subValue}</div>
      )}
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  )
}
