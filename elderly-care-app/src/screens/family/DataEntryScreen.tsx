import { useState } from 'react'
import { useHealthStore } from '../../store/healthStore'
import { CheckCircle } from 'lucide-react'

interface FormData {
  systolic: string
  diastolic: string
  bloodSugar: string
  weight: string
  heartRate: string
  note: string
}

export default function DataEntryScreen() {
  const { addRecord, getLatestRecord } = useHealthStore()
  const latest = getLatestRecord()
  const today = new Date().toISOString().split('T')[0]
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState<FormData>({
    systolic: latest ? String(latest.systolic) : '',
    diastolic: latest ? String(latest.diastolic) : '',
    bloodSugar: latest ? String(latest.bloodSugar) : '',
    weight: latest ? String(latest.weight) : '',
    heartRate: latest ? String(latest.heartRate) : '',
    note: '',
  })

  const handleChange = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    const sys = parseFloat(form.systolic)
    const dia = parseFloat(form.diastolic)
    const sugar = parseFloat(form.bloodSugar)
    const weight = parseFloat(form.weight)
    const hr = parseFloat(form.heartRate)

    if (isNaN(sys) || isNaN(dia) || isNaN(sugar)) {
      alert('请填写血压和血糖数据')
      return
    }

    addRecord({
      date: today,
      systolic: sys,
      diastolic: dia,
      bloodSugar: sugar,
      weight: isNaN(weight) ? 65 : weight,
      heartRate: isNaN(hr) ? 72 : hr,
      note: form.note,
    })

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#F0F4FF]">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-5 pt-6 pb-10 text-white">
        <h1 className="text-3xl font-bold">录入健康数据</h1>
        <p className="text-blue-100 mt-1 text-base">为妈妈记录今日健康指标</p>
      </div>

      <div className="px-4 -mt-6 pb-24">
        {/* Date */}
        <div className="bg-white rounded-2xl p-4 shadow-md mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📅</span>
            <div>
              <div className="text-gray-500 text-sm">记录日期</div>
              <div className="font-bold text-gray-800 text-lg">{today} 今天</div>
            </div>
          </div>
        </div>

        {/* Success */}
        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4 flex items-center gap-3 animate-slide-up">
            <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
            <div>
              <div className="font-bold text-green-700">数据保存成功！</div>
              <div className="text-green-600 text-sm">健康数据已更新</div>
            </div>
          </div>
        )}

        {/* Blood Pressure */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🫀</span>
            <span className="font-bold text-gray-700 text-lg">血压</span>
            <span className="text-xs text-gray-400 ml-1">（必填）</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">收缩压（高压）</label>
              <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-2 focus-within:border-blue-400 transition-colors">
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="如：120"
                  value={form.systolic}
                  onChange={(e) => handleChange('systolic', e.target.value)}
                  className="flex-1 text-lg font-bold text-gray-800 outline-none bg-transparent w-full"
                />
                <span className="text-gray-400 text-sm ml-1">mmHg</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">正常：90-139</div>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">舒张压（低压）</label>
              <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-2 focus-within:border-blue-400 transition-colors">
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="如：80"
                  value={form.diastolic}
                  onChange={(e) => handleChange('diastolic', e.target.value)}
                  className="flex-1 text-lg font-bold text-gray-800 outline-none bg-transparent w-full"
                />
                <span className="text-gray-400 text-sm ml-1">mmHg</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">正常：60-89</div>
            </div>
          </div>
        </div>

        {/* Blood Sugar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🩸</span>
            <span className="font-bold text-gray-700 text-lg">血糖</span>
            <span className="text-xs text-gray-400 ml-1">（必填）</span>
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">空腹血糖</label>
            <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-2 focus-within:border-blue-400 transition-colors">
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                placeholder="如：5.6"
                value={form.bloodSugar}
                onChange={(e) => handleChange('bloodSugar', e.target.value)}
                className="flex-1 text-lg font-bold text-gray-800 outline-none bg-transparent"
              />
              <span className="text-gray-400 text-sm ml-1">mmol/L</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">正常空腹：3.9 - 6.1 mmol/L</div>
          </div>
        </div>

        {/* Weight & Heart Rate */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📊</span>
            <span className="font-bold text-gray-700 text-lg">其他指标</span>
            <span className="text-xs text-gray-400 ml-1">（选填）</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">体重</label>
              <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-2 focus-within:border-blue-400 transition-colors">
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  placeholder="如：65.0"
                  value={form.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  className="flex-1 text-lg font-bold text-gray-800 outline-none bg-transparent w-full"
                />
                <span className="text-gray-400 text-sm ml-1">kg</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">心率</label>
              <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-2 focus-within:border-blue-400 transition-colors">
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="如：72"
                  value={form.heartRate}
                  onChange={(e) => handleChange('heartRate', e.target.value)}
                  className="flex-1 text-lg font-bold text-gray-800 outline-none bg-transparent w-full"
                />
                <span className="text-gray-400 text-sm ml-1">bpm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📝</span>
            <span className="font-bold text-gray-700 text-lg">备注</span>
          </div>
          <textarea
            placeholder="记录今天的状态，如饮食、运动、用药情况等..."
            value={form.note}
            onChange={(e) => handleChange('note', e.target.value)}
            className="w-full border-2 border-gray-200 rounded-xl p-3 text-gray-700 outline-none focus:border-blue-400 transition-colors resize-none text-sm"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-2xl font-bold text-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
        >
          💾 保存健康数据
        </button>

        {/* Reference */}
        <div className="mt-4 bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <div className="font-semibold text-blue-700 mb-2 text-sm">📖 正常参考值</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-blue-600">
            <div>血压：&lt;140/90 mmHg</div>
            <div>空腹血糖：3.9-6.1 mmol/L</div>
            <div>心率：60-100 bpm</div>
            <div>体重：BMI 18.5-23.9</div>
          </div>
        </div>
      </div>
    </div>
  )
}
