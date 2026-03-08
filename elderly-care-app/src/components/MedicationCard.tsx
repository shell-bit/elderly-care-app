import { Medication } from '../types'
import { useMedicationStore } from '../store/medicationStore'
import { CheckCircle, Clock, Pill } from 'lucide-react'

interface Props {
  med: Medication
  time: string
  taken: boolean
  isElderly?: boolean
}

export default function MedicationCard({ med, time, taken, isElderly = false }: Props) {
  const { toggleTaken } = useMedicationStore()
  const today = new Date().toISOString().split('T')[0]
  const timeKey = `${today}-${time}`

  const now = new Date()
  const [h, m] = time.split(':').map(Number)
  const medTime = new Date()
  medTime.setHours(h, m, 0, 0)
  const isPast = now > medTime
  const isUpcoming = !taken && !isPast

  return (
    <div
      className={`
        rounded-2xl p-4 mb-3 border-2 transition-all duration-300 cursor-pointer
        ${taken
          ? 'bg-green-50 border-green-200 opacity-80'
          : isPast
          ? 'bg-red-50 border-red-200'
          : 'bg-white border-orange-200 shadow-md hover:shadow-lg hover:-translate-y-0.5'
        }
      `}
      onClick={() => toggleTaken(med.id, timeKey)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div
            className={`
              w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0
              ${taken ? 'bg-green-100' : isPast ? 'bg-red-100' : 'bg-orange-100'}
            `}
          >
            <Pill size={24} className={taken ? 'text-green-500' : isPast ? 'text-red-400' : 'text-orange-500'} />
          </div>
          <div className="flex-1 min-w-0">
            <div className={`font-bold truncate ${isElderly ? 'text-xl' : 'text-base'} text-gray-800`}>
              {med.name}
            </div>
            <div className={`text-gray-500 ${isElderly ? 'text-base' : 'text-sm'}`}>
              剂量：{med.dosage}
            </div>
            <div className={`text-gray-400 text-sm mt-0.5 truncate`}>{med.notes}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 ml-2">
          <div className={`flex items-center gap-1 ${isElderly ? 'text-lg' : 'text-sm'} font-semibold text-gray-600`}>
            <Clock size={14} />
            {time}
          </div>
          {taken ? (
            <span className="flex items-center gap-1 text-green-600 text-sm font-medium bg-green-100 px-2 py-0.5 rounded-full">
              <CheckCircle size={14} /> 已服用
            </span>
          ) : isPast ? (
            <span className="text-red-500 text-sm font-medium bg-red-100 px-2 py-0.5 rounded-full">⚠️ 漏服</span>
          ) : (
            <span className="text-orange-500 text-sm font-medium bg-orange-100 px-2 py-0.5 rounded-full animate-pulse">
              待服用
            </span>
          )}
        </div>
      </div>
      {isUpcoming && (
        <div className="mt-2 text-xs text-orange-400 font-medium">
          💡 点击标记已服用
        </div>
      )}
    </div>
  )
}
