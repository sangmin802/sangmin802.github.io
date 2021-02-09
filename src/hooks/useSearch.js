import { useState, useCallback, useEffect } from 'react';

export function useSearch() {
  const [search, setSearch] = useState('');

  const changeSearch = useCallback((value) => {
    setSearch(value);
  }, [])


  useEffect(() => {
    const windowEvent = function () {
      setSearch('');
    }
    setSearch('');

    window.addEventListener('click', windowEvent)


    return () => {
      window.removeEventListener('click', windowEvent)
    }
  }, [])

  return [search, changeSearch]
}