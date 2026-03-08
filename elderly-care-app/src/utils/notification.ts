import { Medication } from '../types'

export interface MedReminder {
  medicationId: string
  medicationName: string
  dosage: string
  time: string
  disease: string
}

/**
 * Get all upcoming medication reminders for today
 */
export const getUpcomingReminders = (medications: Medication[]): MedReminder[] => {
  const today = new Date().toISOString().split('T')[0]
  const now = new Date()
  const reminders: MedReminder[] = []

  medications.forEach((med) => {
    med.times.forEach((time) => {
      const takenKey = `${today}-${time}`
      if (med.taken[takenKey]) return

      const [h, m] = time.split(':').map(Number)
      const remindTime = new Date()
      remindTime.setHours(h, m, 0, 0)

      // Only show future reminders within next 2 hours
      const diffMs = remindTime.getTime() - now.getTime()
      if (diffMs > 0 && diffMs <= 2 * 60 * 60 * 1000) {
        reminders.push({
          medicationId: med.id,
          medicationName: med.name,
          dosage: med.dosage,
          time,
          disease: med.disease,
        })
      }
    })
  })

  return reminders.sort((a, b) => a.time.localeCompare(b.time))
}

/**
 * Get overdue medication reminders for today
 */
export const getOverdueReminders = (medications: Medication[]): MedReminder[] => {
  const today = new Date().toISOString().split('T')[0]
  const now = new Date()
  const overdue: MedReminder[] = []

  medications.forEach((med) => {
    med.times.forEach((time) => {
      const takenKey = `${today}-${time}`
      if (med.taken[takenKey]) return

      const [h, m] = time.split(':').map(Number)
      const remindTime = new Date()
      remindTime.setHours(h, m, 0, 0)

      if (remindTime < now) {
        overdue.push({
          medicationId: med.id,
          medicationName: med.name,
          dosage: med.dosage,
          time,
          disease: med.disease,
        })
      }
    })
  })

  return overdue
}

/**
 * Format time string for display
 */
export const formatReminderTime = (time: string): string => {
  const [h, m] = time.split(':').map(Number)
  const period = h < 12 ? '上午' : h < 18 ? '下午' : '晚上'
  const displayH = h > 12 ? h - 12 : h
  return `${period} ${String(displayH).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
