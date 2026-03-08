import { useRoleStore } from '../store/roleStore'
import { FamilyTab } from '../types'
import FamilyHomeScreen from '../screens/family/FamilyHomeScreen'
import HealthChartScreen from '../screens/family/HealthChartScreen'
import DataEntryScreen from '../screens/family/DataEntryScreen'
import RoleSwitch from '../components/RoleSwitch'
import { ClipboardList, TrendingUp, PlusCircle } from 'lucide-react'

const tabs: Array<{ id: FamilyTab; label: string; icon: typeof ClipboardList }> = [
  { id: 'report', label: '健康报告', icon: ClipboardList },
  { id: 'chart', label: '数据图表', icon: TrendingUp },
  { id: 'entry', label: '录入数据', icon: PlusCircle },
]

export default function FamilyLayout() {
  const { familyTab, setFamilyTab } = useRoleStore()

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-blue-600 font-bold text-lg">守护家人</span>
          <span className="text-xs bg-blue-100 text-blue-500 px-2 py-0.5 rounded-full">子女端</span>
        </div>
        <RoleSwitch />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {familyTab === 'report' && <FamilyHomeScreen />}
        {familyTab === 'chart' && <HealthChartScreen />}
        {familyTab === 'entry' && <DataEntryScreen />}
      </div>

      {/* Bottom Tab Bar */}
      <div className="flex bg-white border-t border-gray-100 pb-safe flex-shrink-0 shadow-lg">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = familyTab === id
          return (
            <button
              key={id}
              onClick={() => setFamilyTab(id)}
              className={`
                flex-1 flex flex-col items-center py-3 transition-all duration-200 active:scale-95
                ${active ? 'text-blue-600' : 'text-gray-400'}
              `}
            >
              <Icon size={24} strokeWidth={active ? 2.5 : 1.5} />
              <span className={`text-xs mt-0.5 font-medium ${active ? 'text-blue-600' : 'text-gray-400'}`}>
                {label}
              </span>
              {active && (
                <span className="w-1 h-1 bg-blue-600 rounded-full mt-0.5" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
