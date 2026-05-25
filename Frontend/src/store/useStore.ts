import { create } from 'zustand'
import type { Session } from '@supabase/supabase-js'

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
  session?: Session | null
  business?: Business
  daily?: DailyContent
  setUser: (id: string | undefined) => void
  setSession: (session: Session | null) => void
  setBusiness: (b: Business) => void
  setDaily: (d: DailyContent) => void
}

export const useStore = create<State>((set) => ({
  userId: undefined,
  session: undefined,
  business: undefined,
  daily: undefined,
  setUser: (id) => set(() => ({ userId: id })),
  setSession: (session) => set(() => ({ session })),
  setBusiness: (b) => set(() => ({ business: b })),
  setDaily: (d) => set(() => ({ daily: d })),
}))

export default useStore
