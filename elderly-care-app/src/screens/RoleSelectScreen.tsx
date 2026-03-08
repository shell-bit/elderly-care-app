import { useRoleStore } from '../store/roleStore'
import { Heart, Users } from 'lucide-react'

export default function RoleSelectScreen() {
  const { setRole } = useRoleStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex flex-col items-center justify-center px-6 py-12">
      {/* Header */}
      <div className="text-center mb-14 animate-fade-in">
        <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-400 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-orange-200">
          <Heart size={44} className="text-white" fill="white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">守护家人</h1>
        <p className="text-gray-500 text-lg">关爱健康，守护每一天</p>
      </div>

      {/* Role Buttons */}
      <div className="w-full max-w-sm space-y-5 animate-slide-up">
        {/* Elderly */}
        <button
          onClick={() => setRole('elderly')}
          className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-3xl p-6 shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 hover:-translate-y-1 active:scale-95 transition-all duration-300 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
              👴
            </div>
            <div>
              <div className="text-2xl font-bold mb-0.5">老人端</div>
              <div className="text-orange-100 text-base">用药提醒 · 慢病管理 · 健康记录</div>
            </div>
          </div>
        </button>

        {/* Family */}
        <button
          onClick={() => setRole('family')}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-3xl p-6 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-1 active:scale-95 transition-all duration-300 text-left"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
              👨‍👩‍👧
            </div>
            <div>
              <div className="text-2xl font-bold mb-0.5">子女端</div>
              <div className="text-blue-100 text-base">健康报告 · 数据图表 · 信息录入</div>
            </div>
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="mt-14 text-center animate-fade-in">
        <div className="flex items-center gap-2 text-gray-400 text-sm justify-center">
          <Users size={14} />
          <span>家人共用同一设备，数据实时同步</span>
        </div>
        <div className="mt-3 flex gap-2 justify-center">
          {['🔒 数据安全', '📱 简单易用', '💊 精准提醒'].map((item) => (
            <span key={item} className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
