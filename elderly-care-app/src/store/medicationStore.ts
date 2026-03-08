import { create } from 'zustand'
import { Medication } from '../types'

const today = new Date().toISOString().split('T')[0]

const defaultMedications: Medication[] = [
  {
    id: 'med-1',
    name: '硝苯地平控释片',
    dosage: '30mg',
    times: ['08:00', '20:00'],
    disease: '高血压',
    notes: '饭后服用，不可掰开或研碎',
    taken: { [`${today}-08:00`]: true },
  },
  {
    id: 'med-2',
    name: '二甲双胍缓释片',
    dosage: '500mg',
    times: ['07:30', '12:00', '18:30'],
    disease: '糖尿病',
    notes: '随餐服用，可减少胃肠道不适',
    taken: { [`${today}-07:30`]: true, [`${today}-12:00`]: true },
  },
  {
    id: 'med-3',
    name: '阿托伐他汀钙片',
    dosage: '20mg',
    times: ['21:00'],
    disease: '高血压',
    notes: '睡前服用效果最佳，避免与西柚同服',
    taken: {},
  },
  {
    id: 'med-4',
    name: '阿司匹林肠溶片',
    dosage: '100mg',
    times: ['08:00'],
    disease: '心脏病',
    notes: '饭前服用，若出现黑便立即就医',
    taken: { [`${today}-08:00`]: true },
  },
]

interface MedicationState {
  medications: Medication[]
  addMedication: (med: Omit<Medication, 'id' | 'taken'>) => void
  toggleTaken: (medId: string, timeKey: string) => void
  getTodayMeds: () => Array<{ med: Medication; time: string; taken: boolean }>
}

export const useMedicationStore = create<MedicationState>((set, get) => ({
  medications: defaultMedications,

  addMedication: (med) => {
    const newMed: Medication = {
      ...med,
      id: `med-${Date.now()}`,
      taken: {},
    }
    set((state) => ({ medications: [...state.medications, newMed] }))
  },

  toggleTaken: (medId, timeKey) => {
    set((state) => ({
      medications: state.medications.map((m) => {
        if (m.id !== medId) return m
        const taken = { ...m.taken }
        taken[timeKey] = !taken[timeKey]
        return { ...m, taken }
      }),
    }))
  },

  getTodayMeds: () => {
    const { medications } = get()
    const today = new Date().toISOString().split('T')[0]
    const items: Array<{ med: Medication; time: string; taken: boolean }> = []
    medications.forEach((med) => {
      med.times.forEach((time) => {
        const key = `${today}-${time}`
        items.push({ med, time, taken: !!med.taken[key] })
      })
    })
    items.sort((a, b) => a.time.localeCompare(b.time))
    return items
  },
}))
