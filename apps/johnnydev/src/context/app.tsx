import React, { createContext, SetStateAction, useState } from 'react'
import { Dispatch } from 'react'

interface AppContext {
  showSearch: boolean
  setShowSearch: Dispatch<SetStateAction<boolean>>
  fuseData: any
  setFuseData: Dispatch<SetStateAction<any>>
}

export const AppContext = createContext<AppContext>({
  showSearch: false,
  setShowSearch: () => {},
  fuseData: null,
  setFuseData: () => {},
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
