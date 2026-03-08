import { create } from 'zustand'
import { Role, ElderlyTab, FamilyTab } from '../types'

interface RoleState {
  currentRole: Role
  elderlyTab: ElderlyTab
  familyTab: FamilyTab
  setRole: (role: Role) => void
  setElderlyTab: (tab: ElderlyTab) => void
  setFamilyTab: (tab: FamilyTab) => void
}

export const useRoleStore = create<RoleState>((set) => ({
  currentRole: 'select',
  elderlyTab: 'home',
  familyTab: 'report',
  setRole: (role) => set({ currentRole: role }),
  setElderlyTab: (tab) => set({ elderlyTab: tab }),
  setFamilyTab: (tab) => set({ familyTab: tab }),
}))
