import { useRoleStore } from '../store/roleStore'
import { ArrowLeftRight } from 'lucide-react'

export default function RoleSwitch() {
  const { currentRole, setRole } = useRoleStore()

  if (currentRole === 'select') return null

  const isElderly = currentRole === 'elderly'

  return (
    <button
      onClick={() => setRole(isElderly ? 'family' : 'elderly')}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
        transition-all duration-200 active:scale-95
        ${isElderly
          ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
          : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
        }
      `}
    >
      <ArrowLeftRight size={14} />
      切换至{isElderly ? '子女端' : '老人端'}
    </button>
  )
}
