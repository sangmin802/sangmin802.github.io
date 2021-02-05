import React, { useCallback, useRef } from 'react'
import { rhythm } from '../../utils/typography'
import './index.scss'
import { Item } from './item'

export const ContentNav = ({ navs, nav, selectNav, navType, resetSubNav }) => {
  const containerRef = useRef(null)

  const scrollToCenter = useCallback(tabRef => {
    const { offsetWidth: tabWidth } = tabRef.current
    const { scrollLeft, offsetWidth: containerWidth } = containerRef.current
    const tabLeft = tabRef.current.getBoundingClientRect().left
    const containerLeft = containerRef.current.getBoundingClientRect().left
    const refineLeft = tabLeft - containerLeft
    const targetScollX = scrollLeft + refineLeft - (containerWidth / 2) + (tabWidth / 2)

    containerRef.current.scroll({ left: targetScollX, top: 0, behavior: 'smooth' })
  }, [containerRef])

  return (
    <>
      {navs.indexOf(null) === -1 &&
        <ul
          ref={containerRef}
          className={`${navType}-container`}
          role="tablist"
          id={navType}
          style={{
            margin: `0 -${rhythm(3 / 4)}`,
          }}
        >
          <Item title={'All'} selectedNav={nav} onClick={selectNav} scrollToCenter={scrollToCenter} resetSubNav={resetSubNav} />
          {navs.map((title, idx) => (
            <Item
              key={idx}
              title={title}
              selectedNav={nav}
              onClick={selectNav}
              resetSubNav={resetSubNav}
              scrollToCenter={scrollToCenter}
            />
          ))}
        </ul>
      }
    </>
  )
}
