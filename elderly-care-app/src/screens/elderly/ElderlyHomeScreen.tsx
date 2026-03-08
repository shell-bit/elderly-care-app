import { useMedicationStore } from '../../store/medicationStore'
import { useHealthStore } from '../../store/healthStore'
import MedicationCard from '../../components/MedicationCard'
import { getGreeting, getTodayString, getBloodPressureStatus, getBloodSugarStatus } from '../../utils/healthUtils'

export default function ElderlyHomeScreen() {
  const { getTodayMeds } = useMedicationStore()
  const { getLatestRecord } = useHealthStore()
  const greeting = getGreeting()
  const todayMeds = getTodayMeds()
  const latest = getLatestRecord()

  const totalMeds = todayMeds.length
  const takenMeds = todayMeds.filter((m) => m.taken).length
  const progress = totalMeds > 0 ? (takenMeds / totalMeds) * 100 : 0

  const upcomingMeds = todayMeds.filter((m) => {
    if (m.taken) return false
    const now = new Date()
    const [h, mins] = m.time.split(':').map(Number)
    const t = new Date(); t.setHours(h, mins, 0)
    return t >= now
  }).slice(0, 1)

  return (
    <div className="flex-1 overflow-y-auto pb-24 bg-[#FFF8F5]">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-400 to-orange-500 px-5 pt-6 pb-10 text-white">
        <div className="text-lg mb-0.5 opacity-90">
          {greeting.emoji} {greeting.text}，李奶奶
        </div>
        <div className="text-3xl font-bold mb-1">今日健康管理</div>
        <div className="text-orange-100 text-sm">{getTodayString()}</div>

        {/* Medication Progress */}
        <div className="mt-4 bg-white/20 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-lg">今日用药进度</span>
            <span className="font-bold text-xl">{takenMeds}/{totalMeds}</span>
          </div>
          <div className="h-3 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-1.5 text-orange-100 text-sm">
            {takenMeds === totalMeds ? '🎉 今日用药全部完成！' : `还有 ${totalMeds - takenMeds} 次用药待完成`}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-6">
        {/* Upcoming Reminder */}
        {upcomingMeds.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-md border-l-4 border-orange-400 mb-4 animate-slide-up">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-orange-500 text-lg">⏰</span>
              <span className="font-bold text-gray-700 text-lg">下次用药提醒</span>
            </div>
            {upcomingMeds.map(({ med, time }) => (
              <div key={`${med.id}-${time}`} className="flex items-center gap-3 mt-2">
                <span className="text-2xl font-bold text-orange-500">{time}</span>
                <div>
                  <div className="font-semibold text-gray-800 text-lg">{med.name}</div>
                  <div className="text-gray-500 text-base">{med.dosage} · {med.disease}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Latest Health Data */}
        {latest && (
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-700 mb-3 flex items-center gap-2">
              📊 最新健康数据
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {(() => {
                const bpStatus = getBloodPressureStatus(latest.systolic, latest.diastolic)
                return (
                  <div className="bg-white rounded-2xl p-4 shadow-sm" style={{ borderLeft: `4px solid ${bpStatus.color}` }}>
                    <div className="text-2xl mb-1">🫀</div>
                    <div className="text-2xl font-bold text-gray-800">
                      {latest.systolic}/{latest.diastolic}
                    </div>
                    <div className="text-gray-400 text-sm">mmHg</div>
                    <div className="text-sm mt-1 font-semibold" style={{ color: bpStatus.color }}>
                      血压 · {bpStatus.label}
                    </div>
                  </div>
                )
              })()}
              {(() => {
                const bsStatus = getBloodSugarStatus(latest.bloodSugar)
                return (
                  <div className="bg-white rounded-2xl p-4 shadow-sm" style={{ borderLeft: `4px solid ${bsStatus.color}` }}>
                    <div className="text-2xl mb-1">🩸</div>
                    <div className="text-2xl font-bold text-gray-800">{latest.bloodSugar}</div>
                    <div className="text-gray-400 text-sm">mmol/L</div>
                    <div className="text-sm mt-1 font-semibold" style={{ color: bsStatus.color }}>
                      血糖 · {bsStatus.label}
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        )}

        {/* All Medications */}
        <div>
          <h3 className="text-xl font-bold text-gray-700 mb-3 flex items-center gap-2">
            💊 今日全部用药
          </h3>
          {todayMeds.map(({ med, time, taken }) => (
            <MedicationCard key={`${med.id}-${time}`} med={med} time={time} taken={taken} isElderly />
          ))}
        </div>

        {/* Warning Tips */}
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">⚠️</span>
            <span className="font-bold text-amber-700 text-lg">今日注意事项</span>
          </div>
          <ul className="space-y-1">
            {[
              '按时服药，切勿自行停药',
              '今日天气适合户外散步 30 分钟',
              '饮食清淡，减少盐分摄入',
              '保持心情愉快，避免情绪激动',
            ].map((tip) => (
              <li key={tip} className="text-base text-amber-700 flex items-start gap-1.5">
                <span className="text-amber-400 mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
