import { lowerCase } from 'lodash'
import React, { useCallback, useMemo } from 'react'
import { useSearch } from '../../hooks/useSearch'
import { SearchItem } from './searchItem'
import { graphql, useStaticQuery } from 'gatsby'
import { debounce } from '../../utils/debounce'
import './index.scss'

const Search = () => {
  const data = useStaticQuery(query)

  const [search, setSearch] = useSearch()
  const filterdData = data.allMarkdownRemark.edges.filter(
    ({
      node: {
        frontmatter: { title },
      },
      node,
    }) => {
      if (
        lowerCase(title)
          .replace(/ /g, '')
          .includes(lowerCase(search).replace(/ /g, ''))
      ) {
        return node
      }
    }
  )

  // search debouncing
  const debounceAct = useMemo(() => debounce(), [])
  const onChange = useCallback((e) => {
    const text = e.target.value

    debounceAct(() => {
      setSearch(text)
    }, 300)
  }, [])

  // prevent click event flow
  const onClick = useCallback((e) => {
    e.stopPropagation()
  }, [])

  return (
    <div className="searchWrap">
      <input
        type="text"
        className="search"
        onChange={onChange}
        onClick={onClick}
        placeholder="search post..."
      />
      {filterdData.length !== 0 && search && (
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

export default React.memo(Search, (prev, next) => {
  if (prev.length === next.length) return true
  return false
})

export const query = graphql`
  query {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { category: { ne: null }, draft: { eq: false } } }
    ) {
      edges {
        node {
          excerpt(pruneLength: 200, truncate: true)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            category
            draft
            tag
          }
        }
      }
    }
  }
`
