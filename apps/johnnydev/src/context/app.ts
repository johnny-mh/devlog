import { createContext } from 'react'

export const AppContext = createContext({
  search: false,
  setSearch: (_: boolean) => {},
})
