import { create } from 'zustand'

type Business = {
  business_name?: string
  business_type?: string
  location?: string
}

type DailyContent = {
  date?: string
  context?: string
  ideas?: string[]
  captions?: string[]
  hashtags?: string[]
}

type State = {
  userId?: string
  business?: Business
  daily?: DailyContent
  setUser: (id: string) => void
  setBusiness: (b: Business) => void
  setDaily: (d: DailyContent) => void
}

export const useStore = create<State>((set) => ({
  userId: undefined,
  business: undefined,
  daily: undefined,
  setUser: (id) => set(() => ({ userId: id })),
  setBusiness: (b) => set(() => ({ business: b })),
  setDaily: (d) => set(() => ({ daily: d })),
}))

export default useStore
