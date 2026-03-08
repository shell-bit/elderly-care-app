import { create } from 'zustand'
import { HealthRecord } from '../types'

const generateMockData = (): HealthRecord[] => {
  const records: HealthRecord[] = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    records.push({
      id: `record-${i}`,
      date: dateStr,
      systolic: 120 + Math.floor(Math.random() * 30) - 5,
      diastolic: 75 + Math.floor(Math.random() * 20) - 5,
      bloodSugar: parseFloat((5.5 + Math.random() * 3 - 0.5).toFixed(1)),
      weight: parseFloat((65 + Math.random() * 4 - 2).toFixed(1)),
      heartRate: 68 + Math.floor(Math.random() * 20) - 5,
    })
  }
  return records
}

interface HealthState {
  records: HealthRecord[]
  addRecord: (record: Omit<HealthRecord, 'id'>) => void
  getLatestRecord: () => HealthRecord | null
  getRecordsByDays: (days: number) => HealthRecord[]
}

export const useHealthStore = create<HealthState>((set, get) => ({
  records: generateMockData(),

  addRecord: (record) => {
    const newRecord: HealthRecord = {
      ...record,
      id: `record-${Date.now()}`,
    }
    set((state) => ({
      records: [...state.records, newRecord].sort((a, b) =>
        a.date.localeCompare(b.date)
      ),
    }))
  },

  getLatestRecord: () => {
    const { records } = get()
    if (records.length === 0) return null
    return records[records.length - 1]
  },

  getRecordsByDays: (days) => {
    const { records } = get()
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    const cutoffStr = cutoff.toISOString().split('T')[0]
    return records.filter((r) => r.date >= cutoffStr)
  },
}))
