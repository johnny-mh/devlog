import { atom } from 'nanostores'

interface AppAtom {
  showSearch: boolean
}

export const appAtom = atom<AppAtom>({ showSearch: false })
