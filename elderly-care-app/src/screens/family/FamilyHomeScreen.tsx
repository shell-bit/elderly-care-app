import { useHealthStore } from '../../store/healthStore'
import { useMedicationStore } from '../../store/medicationStore'
import DailyReportCard from '../../components/DailyReportCard'
import { getBloodPressureStatus, getBloodSugarStatus } from '../../utils/healthUtils'
import { Bell, TrendingUp } from 'lucide-react'

export default function FamilyHomeScreen() {
  const { getRecordsByDays } = useHealthStore()
  const { getTodayMeds } = useMedicationStore()
  const recentRecords = getRecordsByDays(7).slice().reverse()
  const todayRecord = recentRecords[0]
  const todayMeds = getTodayMeds()
  const takenCount = todayMeds.filter((m) => m.taken).length

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const hasTodayRecord = todayRecord?.date === todayStr

  const bpStatus = todayRecord ? getBloodPressureStatus(todayRecord.systolic, todayRecord.diastolic) : null
  const bsStatus = todayRecord ? getBloodSugarStatus(todayRecord.bloodSugar) : null

  const hasAlert = bpStatus?.label !== '正常' || bsStatus?.label !== '正常'

  return (
    <div className="flex-1 overflow-y-auto bg-[#F0F4FF]">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-5 pt-6 pb-10 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg opacity-90">子女端 · 每日健康报告</div>
            <div className="text-3xl font-bold mt-0.5">妈妈的健康</div>
          </div>
          <div className="relative">
            <Bell size={28} className="text-white/80" />
            {hasAlert && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full border-2 border-blue-500 animate-pulse" />
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            {
              label: '今日用药',
              value: `${takenCount}/${todayMeds.length}`,
              icon: '💊',
              ok: takenCount === todayMeds.length,
            },
            {
              label: '血压状态',
              value: bpStatus?.label ?? '待记录',
              icon: '🫀',
              ok: bpStatus?.label === '正常',
            },
            {
              label: '血糖状态',
              value: bsStatus?.label ?? '待记录',
              icon: '🩸',
              ok: bsStatus?.label === '正常',
            },
          ].map((card) => (
            <div key={card.label} className="bg-white/20 rounded-2xl p-3 text-center">
              <div className="text-2xl">{card.icon}</div>
              <div className="text-white font-bold text-sm mt-0.5">{card.value}</div>
              <div className="text-blue-100 text-xs">{card.label}</div>
              <div className={`mt-0.5 text-xs font-medium ${card.ok ? 'text-green-300' : 'text-yellow-300'}`}>
                {card.ok ? '✓ 良好' : '⚠ 关注'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Banner */}
      {hasAlert && todayRecord && (
        <div className="mx-4 -mt-4 mb-4 bg-amber-50 border border-amber-300 rounded-2xl p-4 shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">⚠️</span>
            <span className="font-bold text-amber-700 text-base">健康异常提醒</span>
          </div>
          <div className="text-amber-600 text-sm">
            {bpStatus?.label !== '正常' && `血压${bpStatus?.label}（${todayRecord.systolic}/${todayRecord.diastolic} mmHg），`}
            {bsStatus?.label !== '正常' && `血糖${bsStatus?.label}（${todayRecord.bloodSugar} mmol/L），`}
            请及时关注并必要时就医。
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-4 -mt-4 pb-24">
        {/* Today Report */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-700">📋 今日健康报告</h3>
            {!hasTodayRecord && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                暂无今日数据
              </span>
            )}
          </div>
          {hasTodayRecord ? (
            <DailyReportCard record={todayRecord} isToday />
          ) : (
            <div className="bg-white rounded-2xl p-6 text-center border-2 border-dashed border-gray-200">
              <div className="text-4xl mb-2">📝</div>
              <div className="text-gray-500 text-base">今天还没有健康数据</div>
              <div className="text-gray-400 text-sm mt-1">请在"录入"页面添加今日数据</div>
            </div>
          )}
        </div>

        {/* Medication Status */}
        <div className="mb-5">
          <h3 className="text-xl font-bold text-gray-700 mb-3 flex items-center gap-2">
            💊 今日用药情况
          </h3>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600">完成率</span>
              <span className="font-bold text-lg text-gray-800">{takenCount}/{todayMeds.length}</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${todayMeds.length ? (takenCount / todayMeds.length) * 100 : 0}%` }}
              />
            </div>
            <div className="space-y-2">
              {todayMeds.slice(0, 4).map(({ med, time, taken }) => (
                <div key={`${med.id}-${time}`} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${taken ? 'bg-green-400' : 'bg-gray-300'}`} />
                    <span className="text-gray-700">{med.name} {med.dosage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{time}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${taken ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {taken ? '已服' : '未服'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Records */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-700 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" />
              近期健康趋势
            </h3>
          </div>
          {recentRecords.slice(1, 4).map((record) => (
            <DailyReportCard key={record.id} record={record} />
          ))}
        </div>
      </div>
    </div>
  )
}
