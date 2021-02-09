import React from 'react'
import { Link } from 'gatsby'
import { Search } from '../search';
import styled from 'styled-components';
import { StaticQuery, graphql } from 'gatsby'

import './index.scss'

const S_Top = styled.div`
  display: flex;
  justify-content: ${({ isRoot }) => isRoot ? 'flex-end' : 'space-between'};
`

export const Top = ({ title, location, rootPath }) => {
  const isRoot = location.pathname === rootPath
  return (
    <S_Top className="top" isRoot={isRoot}>
      {!isRoot && (
        <Link to={`/`} className="link">
          {title}
        </Link>
      )}
      <StaticQuery
        query={searchQuery}
        render={({ allMarkdownRemark: { edges } }) => <Search data={edges} />}
      />
    </S_Top>
  )
}

export const searchQuery = graphql`
  query {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
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