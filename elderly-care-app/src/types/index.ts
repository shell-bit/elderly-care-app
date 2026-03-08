export type Role = 'select' | 'elderly' | 'family'

export type ElderlyTab = 'home' | 'disease' | 'records'
export type FamilyTab = 'report' | 'chart' | 'entry'

export interface Medication {
  id: string
  name: string
  dosage: string
  times: string[]
  disease: string
  notes: string
  taken: Record<string, boolean>
}

export interface HealthRecord {
  id: string
  date: string
  systolic: number
  diastolic: number
  bloodSugar: number
  weight: number
  heartRate: number
  note?: string
}

export interface DiseaseInfo {
  id: string
  name: string
  icon: string
  color: string
  bgColor: string
  description: string
  dietAdvice: string[]
  exerciseAdvice: string[]
  prohibitions: string[]
  medications: string[]
  warningSymptoms: string[]
}

export interface NotificationSchedule {
  medicationId: string
  time: string
  enabled: boolean
}
