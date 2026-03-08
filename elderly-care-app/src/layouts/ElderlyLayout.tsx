import { useRoleStore } from '../store/roleStore'
import { ElderlyTab } from '../types'
import ElderlyHomeScreen from '../screens/elderly/ElderlyHomeScreen'
import DiseaseGuideScreen from '../screens/elderly/DiseaseGuideScreen'
import HealthRecordScreen from '../screens/elderly/HealthRecordScreen'
import RoleSwitch from '../components/RoleSwitch'
import { Home, BookOpen, Activity } from 'lucide-react'

const tabs: Array<{ id: ElderlyTab; label: string; icon: typeof Home }> = [
  { id: 'home', label: '用药提醒', icon: Home },
  { id: 'disease', label: '慢病指南', icon: BookOpen },
  { id: 'records', label: '健康记录', icon: Activity },
]

export default function ElderlyLayout() {
  const { elderlyTab, setElderlyTab } = useRoleStore()

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 font-bold text-lg">守护家人</span>
          <span className="text-xs bg-orange-100 text-orange-500 px-2 py-0.5 rounded-full">老人端</span>
        </div>
        <RoleSwitch />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {elderlyTab === 'home' && <ElderlyHomeScreen />}
        {elderlyTab === 'disease' && <DiseaseGuideScreen />}
        {elderlyTab === 'records' && <HealthRecordScreen />}
      </div>

      {/* Bottom Tab Bar */}
      <div className="flex bg-white border-t border-gray-100 pb-safe flex-shrink-0 shadow-lg">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = elderlyTab === id
          return (
            <button
              key={id}
              onClick={() => setElderlyTab(id)}
              className={`
                flex-1 flex flex-col items-center py-3 transition-all duration-200 active:scale-95
                ${active ? 'text-orange-500' : 'text-gray-400'}
              `}
            >
              <Icon size={24} strokeWidth={active ? 2.5 : 1.5} />
              <span className={`text-xs mt-0.5 font-medium ${active ? 'text-orange-500' : 'text-gray-400'}`}>
                {label}
              </span>
              {active && (
                <span className="w-1 h-1 bg-orange-500 rounded-full mt-0.5" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
