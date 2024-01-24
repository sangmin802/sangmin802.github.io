import React from 'react'
import { Link, useStaticQuery } from 'gatsby'
import Search from '../search'
import styled from 'styled-components'
import { graphql } from 'gatsby'

import './index.scss'

const S_Top = styled.div`
  display: flex;
  justify-content: ${({ $isRoot }) => ($isRoot ? 'flex-end' : 'space-between')};
`

export const Top = ({ title, location, rootPath }) => {
  const isRoot = location.pathname === rootPath
  const data = useStaticQuery(searchQuery)

  const {
    allMarkdownRemark: { edges },
  } = data

  return (
    <div className="top">
      <S_Top className="innerTop" $isRoot={isRoot}>
        {!isRoot && (
          <Link to={`/`} className="link">
            {title}
          </Link>
        )}
        <Search data={edges} />
      </S_Top>
    </div>
  )
}

export const searchQuery = graphql`
  query {
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }, limit: 1000) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
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
