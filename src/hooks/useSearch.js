import { useState, useEffect } from 'react'

export function useSearch() {
  const [search, setSearch] = useState('')

  useEffect(() => {
    const windowEvent = function() {
      setSearch('')
    }
    setSearch('')

    window.addEventListener('click', windowEvent)

    return () => {
      window.removeEventListener('click', windowEvent)
    }
  }, [])

  return [search, setSearch]
}
