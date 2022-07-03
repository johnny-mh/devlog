import { createContext, useState } from 'react'

export const AppContext = createContext({
  showSearch: false,
  setShowSearch: (_: boolean) => {},
  fuseData: null,
  setFuseData: (_: any) => {},
})

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [showSearch, setShowSearch] = useState(false)
  const [fuseData, setFuseData] = useState(null)

  return (
    <AppContext.Provider
      value={{ showSearch, setShowSearch, fuseData, setFuseData }}
    >
      {children}
    </AppContext.Provider>
  )
}
