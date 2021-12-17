import React from 'react'

const ContextChanges = React.createContext({
  isDarkTheme: false,
  videoStatus: false,
  toggleTheme: () => {},
  addToSavedVideos: () => {},
  removeFromSavedVideos: () => {},
  savedVideos: [],
})

export default ContextChanges
