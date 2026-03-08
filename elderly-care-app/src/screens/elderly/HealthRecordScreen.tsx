import { useHealthStore } from '../../store/healthStore'
import { getBloodPressureStatus, getBloodSugarStatus, formatDate } from '../../utils/healthUtils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function HealthRecordScreen() {
  const { getRecordsByDays } = useHealthStore()
  const records = getRecordsByDays(14).slice().reverse()

  const getTrend = (current: number, previous: number) => {
    const diff = current - previous
    if (Math.abs(diff) < 2) return <Minus size={14} className="text-gray-400" />
    if (diff > 0) return <TrendingUp size={14} className="text-red-400" />
    return <TrendingDown size={14} className="text-green-400" />
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#FFF8F5]">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-400 to-orange-500 px-5 pt-6 pb-10 text-white">
        <h1 className="text-3xl font-bold">健康记录</h1>
        <p className="text-orange-100 mt-1 text-base">近14天的健康数据记录</p>
      </div>

      {/* Stats Summary */}
      <div className="px-4 -mt-6 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow-md grid grid-cols-3 gap-3">
          {[
            { label: '记录天数', value: records.length, unit: '天', icon: '📅' },
            { label: '平均血压', value: records.length > 0 ? Math.round(records.reduce((s, r) => s + r.systolic, 0) / records.length) : '--', unit: 'mmHg', icon: '🫀' },
            { label: '平均血糖', value: records.length > 0 ? (records.reduce((s, r) => s + r.bloodSugar, 0) / records.length).toFixed(1) : '--', unit: 'mmol', icon: '🩸' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.unit}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Records List */}
      <div className="px-4 pb-24">
        <h3 className="text-xl font-bold text-gray-700 mb-3">📋 详细记录</h3>
        {records.map((record, idx) => {
          const bpStatus = getBloodPressureStatus(record.systolic, record.diastolic)
          const bsStatus = getBloodSugarStatus(record.bloodSugar)
          const prev = records[idx + 1]
          const isToday = record.date === new Date().toISOString().split('T')[0]

          return (
            <div
              key={record.id}
              className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100 animate-fade-in"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-700 text-lg">
                    {isToday ? '📍 今天' : formatDate(record.date)}
                  </span>
                  {isToday && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">最新</span>}
                </div>
                <span className="text-sm text-gray-400">{record.date}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Blood Pressure */}
                <div className="rounded-xl p-3" style={{ backgroundColor: bpStatus.bg }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">🫀 血压</span>
                    {prev && getTrend(record.systolic, prev.systolic)}
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    {record.systolic}/{record.diastolic}
                  </div>
                  <div className="text-xs text-gray-400">mmHg</div>
                  <div className="text-xs font-semibold mt-1" style={{ color: bpStatus.color }}>
                    {bpStatus.label}
                  </div>
                </div>

                {/* Blood Sugar */}
                <div className="rounded-xl p-3" style={{ backgroundColor: bsStatus.bg }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">🩸 血糖</span>
                    {prev && getTrend(record.bloodSugar * 10, prev.bloodSugar * 10)}
                  </div>
                  <div className="text-xl font-bold text-gray-800">{record.bloodSugar}</div>
                  <div className="text-xs text-gray-400">mmol/L</div>
                  <div className="text-xs font-semibold mt-1" style={{ color: bsStatus.color }}>
                    {bsStatus.label}
                  </div>
                </div>

                {/* Weight */}
                <div className="rounded-xl p-3 bg-purple-50">
                  <div className="text-xs text-gray-500 mb-1">⚖️ 体重</div>
                  <div className="text-xl font-bold text-gray-800">{record.weight}</div>
                  <div className="text-xs text-gray-400">kg</div>
                </div>

                {/* Heart Rate */}
                <div className="rounded-xl p-3 bg-pink-50">
                  <div className="text-xs text-gray-500 mb-1">💓 心率</div>
                  <div className="text-xl font-bold text-gray-800">{record.heartRate}</div>
                  <div className="text-xs text-gray-400">次/分</div>
                  <div className={`text-xs font-semibold mt-1 ${record.heartRate >= 60 && record.heartRate <= 100 ? 'text-green-500' : 'text-red-500'}`}>
                    {record.heartRate >= 60 && record.heartRate <= 100 ? '正常' : '异常'}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
