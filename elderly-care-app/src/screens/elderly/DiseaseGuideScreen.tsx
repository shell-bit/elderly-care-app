import { useState } from 'react'
import { diseases } from '../../data/diseases'
import { DiseaseInfo } from '../../types'
import { ChevronDown, ChevronUp } from 'lucide-react'

function SectionCard({
  title,
  icon,
  items,
  color,
}: {
  title: string
  icon: string
  items: string[]
  color: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white rounded-2xl mb-3 overflow-hidden shadow-sm border border-gray-100">
      <button
        className="w-full flex items-center justify-between p-4"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <span className="font-bold text-gray-800 text-lg">{title}</span>
        </div>
        {open ? (
          <ChevronUp size={20} className="text-gray-400" />
        ) : (
          <ChevronDown size={20} className="text-gray-400" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 animate-fade-in">
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700 text-base">
                <span className="mt-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                  style={{ backgroundColor: color }}>
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function DiseaseDetail({ disease }: { disease: DiseaseInfo }) {
  return (
    <div className="px-4 pb-24 animate-fade-in">
      {/* Banner */}
      <div
        className="rounded-2xl p-5 mb-4 text-white"
        style={{ backgroundColor: disease.color }}
      >
        <div className="text-5xl mb-2">{disease.icon}</div>
        <h2 className="text-2xl font-bold mb-1">{disease.name}</h2>
        <p className="text-white/85 text-base leading-relaxed">{disease.description}</p>
      </div>

      {/* Warning symptoms */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🚨</span>
          <span className="font-bold text-red-700 text-lg">紧急就医信号</span>
        </div>
        <ul className="space-y-1">
          {disease.warningSymptoms.map((s, i) => (
            <li key={i} className="text-red-600 text-base flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      </div>

      <SectionCard title="饮食建议" icon="🥗" items={disease.dietAdvice} color={disease.color} />
      <SectionCard title="运动建议" icon="🏃" items={disease.exerciseAdvice} color={disease.color} />
      <SectionCard title="用药禁忌" icon="⛔" items={disease.prohibitions} color={disease.color} />

      {/* Medications */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">💊</span>
          <span className="font-bold text-gray-800 text-lg">常用药物参考</span>
        </div>
        <div className="space-y-2">
          {disease.medications.map((med, i) => (
            <div key={i} className="flex items-center gap-2 text-base text-gray-700">
              <span
                className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: disease.color }}
              >
                {i + 1}
              </span>
              {med}
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-400">⚠️ 具体用药请遵医嘱，切勿自行调整</p>
      </div>
    </div>
  )
}

export default function DiseaseGuideScreen() {
  const [selectedId, setSelectedId] = useState('hypertension')
  const selected = diseases.find((d) => d.id === selectedId)!

  return (
    <div className="flex-1 overflow-y-auto bg-[#FFF8F5]">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-400 to-orange-500 px-5 pt-6 pb-4 text-white">
        <h1 className="text-3xl font-bold">慢性病管理</h1>
        <p className="text-orange-100 mt-1 text-base">了解您的疾病，科学管理健康</p>
      </div>

      {/* Disease Tabs */}
      <div className="px-4 py-3 bg-white shadow-sm sticky top-0 z-10">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {diseases.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedId(d.id)}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap
                transition-all duration-200 active:scale-95 flex-shrink-0
                ${selectedId === d.id
                  ? 'text-white shadow-md'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }
              `}
              style={selectedId === d.id ? { backgroundColor: d.color } : {}}
            >
              {d.icon} {d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Detail */}
      <div className="pt-4">
        <DiseaseDetail disease={selected} />
      </div>
    </div>
  )
}
