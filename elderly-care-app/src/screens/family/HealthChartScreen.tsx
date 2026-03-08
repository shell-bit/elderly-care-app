import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend, Area, AreaChart
} from 'recharts'
import { useHealthStore } from '../../store/healthStore'
import { formatDate, calcStats } from '../../utils/healthUtils'

type Metric = 'bp' | 'sugar' | 'weight' | 'heartRate'
type Range = 7 | 30

const metricConfig: Record<Metric, { label: string; icon: string; color: string; color2?: string; unit: string; refMin?: number; refMax?: number }> = {
  bp: { label: '血压', icon: '🫀', color: '#F44336', color2: '#FF9800', unit: 'mmHg', refMin: 90, refMax: 140 },
  sugar: { label: '血糖', icon: '🩸', color: '#FF9800', unit: 'mmol/L', refMin: 3.9, refMax: 7.0 },
  weight: { label: '体重', icon: '⚖️', color: '#9C27B0', unit: 'kg' },
  heartRate: { label: '心率', icon: '💓', color: '#E91E63', unit: 'bpm', refMin: 60, refMax: 100 },
}

export default function HealthChartScreen() {
  const [metric, setMetric] = useState<Metric>('bp')
  const [range, setRange] = useState<Range>(7)
  const { getRecordsByDays } = useHealthStore()
  const records = getRecordsByDays(range)
  const cfg = metricConfig[metric]

  const chartData = records.map((r) => ({
    date: formatDate(r.date),
    systolic: r.systolic,
    diastolic: r.diastolic,
    sugar: r.bloodSugar,
    weight: r.weight,
    heartRate: r.heartRate,
  }))

  const statsValues =
    metric === 'bp'
      ? records.map((r) => r.systolic)
      : metric === 'sugar'
      ? records.map((r) => r.bloodSugar)
      : metric === 'weight'
      ? records.map((r) => r.weight)
      : records.map((r) => r.heartRate)

  const stats = calcStats(statsValues)

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg text-sm">
        <div className="font-bold text-gray-700 mb-1">{label}</div>
        {payload.map((entry: any) => (
          <div key={entry.dataKey} style={{ color: entry.color }}>
            {entry.name}: <strong>{entry.value}</strong> {cfg.unit}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#F0F4FF]">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-5 pt-6 pb-4 text-white">
        <h1 className="text-3xl font-bold">健康趋势</h1>
        <p className="text-blue-100 mt-1 text-base">可视化健康数据分析</p>
      </div>

      {/* Metric Tabs */}
      <div className="bg-white px-4 py-3 shadow-sm sticky top-0 z-10">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(Object.keys(metricConfig) as Metric[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`
                flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap flex-shrink-0
                transition-all duration-200 active:scale-95
                ${metric === m ? 'text-white shadow-md' : 'bg-gray-100 text-gray-500'}
              `}
              style={metric === m ? { backgroundColor: metricConfig[m].color } : {}}
            >
              {metricConfig[m].icon} {metricConfig[m].label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 pb-24">
        {/* Range Switcher */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-700">
            {cfg.icon} {cfg.label}趋势图
          </h3>
          <div className="flex bg-gray-100 rounded-xl p-1">
            {([7, 30] as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  range === r ? 'bg-white shadow text-blue-600' : 'text-gray-500'
                }`}
              >
                {r}天
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <ResponsiveContainer width="100%" height={220}>
            {metric === 'bp' ? (
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis domain={[60, 200]} tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {cfg.refMax && <ReferenceLine y={cfg.refMax} stroke="#F44336" strokeDasharray="4 4" label={{ value: '上限', position: 'right', fontSize: 10, fill: '#F44336' }} />}
                {cfg.refMin && <ReferenceLine y={cfg.refMin} stroke="#2196F3" strokeDasharray="4 4" label={{ value: '下限', position: 'right', fontSize: 10, fill: '#2196F3' }} />}
                <Line type="monotone" dataKey="systolic" name="收缩压" stroke={cfg.color} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="diastolic" name="舒张压" stroke={cfg.color2} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            ) : (
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={cfg.color} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={cfg.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                {cfg.refMax && <ReferenceLine y={cfg.refMax} stroke="#F44336" strokeDasharray="4 4" label={{ value: '上限', position: 'right', fontSize: 10, fill: '#F44336' }} />}
                {cfg.refMin && <ReferenceLine y={cfg.refMin} stroke="#2196F3" strokeDasharray="4 4" label={{ value: '下限', position: 'right', fontSize: 10, fill: '#2196F3' }} />}
                <Area
                  type="monotone"
                  dataKey={metric === 'sugar' ? 'sugar' : metric === 'weight' ? 'weight' : 'heartRate'}
                  name={cfg.label}
                  stroke={cfg.color}
                  strokeWidth={2.5}
                  fill="url(#colorGrad)"
                  dot={{ r: 3, fill: cfg.color }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '平均值', value: stats.avg, color: '#2196F3' },
            { label: '最低值', value: stats.min, color: '#4CAF50' },
            { label: '最高值', value: stats.max, color: '#F44336' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm text-center">
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{cfg.unit}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Reference Info */}
        {(cfg.refMin || cfg.refMax) && (
          <div className="mt-4 bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <div className="font-semibold text-blue-700 mb-1 flex items-center gap-1">
              ℹ️ 参考范围
            </div>
            <div className="text-sm text-blue-600">
              {cfg.label}正常范围：{cfg.refMin} - {cfg.refMax} {cfg.unit}
            </div>
            {metric === 'bp' && (
              <div className="text-xs text-blue-400 mt-1">收缩压/舒张压，以收缩压为主要参考</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
