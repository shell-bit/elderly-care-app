export const getBloodPressureStatus = (systolic: number, diastolic: number) => {
  if (systolic >= 180 || diastolic >= 120) return { label: '高血压危象', color: '#B71C1C', bg: '#FFEBEE' }
  if (systolic >= 160 || diastolic >= 100) return { label: '重度偏高', color: '#D32F2F', bg: '#FFEBEE' }
  if (systolic >= 140 || diastolic >= 90) return { label: '偏高', color: '#F44336', bg: '#FFF3F3' }
  if (systolic >= 130 || diastolic >= 85) return { label: '偏高', color: '#FF9800', bg: '#FFF8E1' }
  if (systolic < 90 || diastolic < 60) return { label: '偏低', color: '#2196F3', bg: '#E3F2FD' }
  return { label: '正常', color: '#4CAF50', bg: '#F1F8E9' }
}

export const getBloodSugarStatus = (value: number, isFasting = true) => {
  if (isFasting) {
    if (value >= 11.1) return { label: '严重偏高', color: '#D32F2F', bg: '#FFEBEE' }
    if (value >= 7.0) return { label: '偏高', color: '#F44336', bg: '#FFF3F3' }
    if (value < 3.9) return { label: '低血糖', color: '#2196F3', bg: '#E3F2FD' }
    return { label: '正常', color: '#4CAF50', bg: '#F1F8E9' }
  } else {
    if (value >= 11.1) return { label: '偏高', color: '#F44336', bg: '#FFF3F3' }
    if (value < 3.9) return { label: '低血糖', color: '#2196F3', bg: '#E3F2FD' }
    return { label: '正常', color: '#4CAF50', bg: '#F1F8E9' }
  }
}

export const getWeightStatus = (weight: number, height = 165) => {
  const bmi = weight / Math.pow(height / 100, 2)
  if (bmi >= 30) return { label: '肥胖', color: '#D32F2F', bg: '#FFEBEE' }
  if (bmi >= 24) return { label: '偏重', color: '#FF9800', bg: '#FFF8E1' }
  if (bmi < 18.5) return { label: '偏轻', color: '#2196F3', bg: '#E3F2FD' }
  return { label: '正常', color: '#4CAF50', bg: '#F1F8E9' }
}

export const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

export const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 6) return { text: '凌晨好', emoji: '🌙' }
  if (hour < 11) return { text: '早上好', emoji: '☀️' }
  if (hour < 14) return { text: '中午好', emoji: '🌤️' }
  if (hour < 18) return { text: '下午好', emoji: '🌅' }
  return { text: '晚上好', emoji: '🌙' }
}

export const getTodayString = () => {
  const d = new Date()
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 星期${weekDays[d.getDay()]}`
}

export const calcStats = (values: number[]) => {
  if (values.length === 0) return { avg: 0, min: 0, max: 0 }
  const avg = parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1))
  const min = Math.min(...values)
  const max = Math.max(...values)
  return { avg, min, max }
}
