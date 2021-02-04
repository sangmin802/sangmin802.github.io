import React, { useRef, useCallback, useEffect } from 'react'

export const Item = ({ title, selectedNav, onClick, scrollToCenter, resetSubNav }) => {
  const tabRef = useRef(null)

  const handleClick = useCallback(() => {
    scrollToCenter(tabRef)
    if (resetSubNav) resetSubNav('All')
    onClick(title)
  }, [tabRef])

  useEffect(() => {
    if (selectedNav === title) {
      scrollToCenter(tabRef)
    }
  }, [selectedNav, tabRef])

  return (
    <li
      ref={tabRef}
      className="item"
      role="tab"
      aria-selected={selectedNav === title ? 'true' : 'false'}
    >
      <div onClick={handleClick}>{title}</div>
    </li>
  )
}
