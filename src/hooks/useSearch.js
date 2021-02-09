import { useState, useCallback, useEffect } from 'react';

export function useSearch() {
  const [search, setSearch] = useState('');

  const changeSearch = useCallback((value) => {
    setSearch(value);
  }, [])


  useEffect(() => {
    setSearch('');
    window.addEventListener('click', windowEvent)

    const windowEvent = function () {
      setSearch('');
    }

    return () => {
      window.removeEventListener('click', windowEvent)
    }
  }, [])

  return [search, changeSearch]
}