import { useEffect, useState, useCallback } from 'react'
import qs from 'query-string'
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
    const { category } = qs.parse(location.search);
    const tagPath = tag === 'All' ? '' : `&${qs.stringify({ tag })}`
    window.history.pushState(
      { tag },
      '',
      `${window.location.pathname}?${qs.stringify({ category })}${tagPath}`
    )
  }, [])

  const reset = useCallback(() => setTag('All'));

  const changeTag = useCallback((withScroll = true) => {
    const { tag } = qs.parse(location.search)
    const target = tag == null ? TAG_TYPE.ALL : tag
    setTag(target)

    // setTag(TAG_TYPE.ALL)
    if (withScroll) {
      adjustScroll()
    }
  }, [])

  // useCategory에서 실행됨
  // useEffect(() => {
  //   ScrollManager.init()
  //   return () => {
  //     ScrollManager.destroy()
  //   }
  // }, [])

  useEffect(() => {
    window.addEventListener('popstate', changeTag)

    return () => {
      window.removeEventListener('popstate', changeTag)
    }
  }, [])

  useEffect(() => {
    changeTag(false)
  }, [])

  return [tag, selectTag, reset]
}