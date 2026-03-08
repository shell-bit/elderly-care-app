import { useRoleStore } from './store/roleStore'
import RoleSelectScreen from './screens/RoleSelectScreen'
import ElderlyLayout from './layouts/ElderlyLayout'
import FamilyLayout from './layouts/FamilyLayout'

export default function App() {
  const { currentRole } = useRoleStore()

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Mobile Frame */}
      <div className="w-full max-w-sm h-screen max-h-[844px] bg-white overflow-hidden flex flex-col relative shadow-2xl md:rounded-[40px]">
        {currentRole === 'select' && <RoleSelectScreen />}
        {currentRole === 'elderly' && <ElderlyLayout />}
        {currentRole === 'family' && <FamilyLayout />}
      </div>
    </div>
  )
}
