import { HealthRecord } from '../types'
import { getBloodPressureStatus, getBloodSugarStatus } from '../utils/healthUtils'

interface Props {
  record: HealthRecord
  isToday?: boolean
}

export default function DailyReportCard({ record, isToday }: Props) {
  const bpStatus = getBloodPressureStatus(record.systolic, record.diastolic)
  const bsStatus = getBloodSugarStatus(record.bloodSugar)
  const d = new Date(record.date)
  const dateLabel = isToday
    ? '今天'
    : `${d.getMonth() + 1}月${d.getDate()}日`

  const items = [
    {
      label: '血压',
      value: `${record.systolic}/${record.diastolic}`,
      unit: 'mmHg',
      icon: '🫀',
      status: bpStatus,
    },
    {
      label: '血糖',
      value: record.bloodSugar,
      unit: 'mmol/L',
      icon: '🩸',
      status: bsStatus,
    },
    {
      label: '体重',
      value: record.weight,
      unit: 'kg',
      icon: '⚖️',
      status: { label: '已记录', color: '#757575', bg: '#F5F5F5' },
    },
    {
      label: '心率',
      value: record.heartRate,
      unit: 'bpm',
      icon: '💓',
      status: record.heartRate >= 60 && record.heartRate <= 100
        ? { label: '正常', color: '#4CAF50', bg: '#F1F8E9' }
        : { label: '异常', color: '#F44336', bg: '#FFF3F3' },
    },
  ]

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3">
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-gray-700 text-base">{dateLabel} 健康报告</span>
        {isToday && (
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
            最新
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl p-3 flex items-center gap-2"
            style={{ backgroundColor: item.status.bg }}
          >
            <span className="text-xl">{item.icon}</span>
            <div>
              <div className="text-xs text-gray-500">{item.label}</div>
              <div className="font-bold text-gray-800 text-sm">
                {item.value}
                <span className="text-xs font-normal text-gray-400 ml-0.5">{item.unit}</span>
              </div>
              <div className="text-xs font-medium" style={{ color: item.status.color }}>
                {item.status.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
