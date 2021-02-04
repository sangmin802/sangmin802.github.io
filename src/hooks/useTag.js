import { useEffect, useState, useCallback } from 'react'
// import qs from 'query-string'
import { TAG_TYPE } from '../constants'
import * as ScrollManager from '../utils/scroll'

const DEST_POS = 316

export function useTag() {
  const [tag, setTag] = useState()
  const adjustScroll = () => {
    if (window.scrollY > DEST_POS) {
      ScrollManager.go(DEST_POS)
    }
  }
  const selectTag = useCallback(tag => {
    setTag(tag)
    adjustScroll()
    // window.history.pushState(
    //   { category },
    //   '',
    //   `${window.location.pathname}?${qs.stringify({ category })}`
    // )
  }, [])
  const changeTag = useCallback((withScroll = true) => {
    // const { category } = qs.parse(location.search)
    // const target = category == null ? CATEGORY_TYPE.ALL : category

    setTag(TAG_TYPE.ALL)
    if (withScroll) {
      adjustScroll()
    }
  }, [])

  useEffect(() => {
    ScrollManager.init()
    return () => {
      ScrollManager.destroy()
    }
  }, [])

  useEffect(() => {
    window.addEventListener('popstate', changeTag)

    return () => {
      window.removeEventListener('popstate', changeTag)
    }
  }, [])

  useEffect(() => {
    changeTag(false)
  }, [])

  return [tag, selectTag]
}
