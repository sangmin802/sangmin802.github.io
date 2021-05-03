import { lowerCase } from 'lodash'
import React, { useCallback } from 'react'
import { useSearch } from '../../hooks/useSearch'
import { SearchItem } from './searchItem'

import './index.scss'

function _Search({ data }) {
  const [search, changeSearch] = useSearch()

  const filterdData = data.filter(
    ({
      node: {
        frontmatter: { title },
      },
      node,
    }) => {
      if (
        lowerCase(title)
          .replace(/ /g, '')
          .includes(lowerCase(search))
      ) {
        return node
      }
    }
  )

  const onChange = useCallback(
    e => {
      changeSearch(e.target.value)
    },
    [changeSearch]
  )

  const onClick = useCallback(e => {
    e.stopPropagation()
  }, [])

  return (
    <div className="searchWrap">
      <input
        type="text"
        className="search"
        value={search}
        onChange={onChange}
        onClick={onClick}
        placeholder="search post..."
      />
      {filterdData.length !== 0 && search !== '' && (
        <div className="searchList">
          <div className="searchArea">
            {filterdData.map(({ node }, index) => {
              const {
                fields: { slug },
                frontmatter: { title },
              } = node

              return (
                <SearchItem
                  slug={slug}
                  title={title}
                  key={`searchItem${index}`}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export const Search = React.memo(_Search, (prev, next) => {
  if (prev.length === next.length) return true
  return false
})
