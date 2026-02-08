import { create } from 'zustand'

type SearchState = {
  query: string
  setQuery: (q: string) => void
  clear: () => void
}

export const useSearchStore = create<SearchState>((set: any) => ({
  query: '',
  setQuery: (q: string) => set({ query: q }),
  clear: () => set({ query: '' }),
}))

export default useSearchStore
