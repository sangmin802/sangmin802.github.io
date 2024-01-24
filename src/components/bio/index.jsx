import React from 'react'
import { graphql, Link, useStaticQuery } from 'gatsby'
import Image from 'gatsby-image'

import './index.scss'

export const Bio = () => {
  const data = useStaticQuery(bioQuery)

  const { author, social, introduction } = data.site.siteMetadata
  return (
    <div className="bio">
      <div className="author">
        <div className="author-description">
          <Image
            className="author-image"
            fixed={data.avatar.childImageSharp.fixed}
            alt={author}
          />
          <div className="author-name">
            <span className="author-name-prefix"></span>
            <Link to={'/about'} className="author-name-content">
              <span>@{author}</span>
            </Link>
            <div className="author-introduction">{introduction}</div>
            <p className="author-socials">
              {social.github && (
                <a href={`${social.github}`} target="_blank">
                  🚀GitHub
                </a>
              )}
              {social.portfolio && (
                <a href={`${social.portfolio}`} target="_blank">
                  🏆Portfolio
                </a>
              )}
              {social.medium && (
                <a href={`https://medium.com/${social.medium}`}>Medium</a>
              )}
              {social.twitter && (
                <a href={`https://twitter.com/${social.twitter}`}>Twitter</a>
              )}
              {social.facebook && (
                <a href={`https://www.facebook.com/${social.facebook}`}>
                  Facebook
                </a>
              )}
              {social.linkedin && (
                <a href={`https://www.linkedin.com/in/${social.linkedin}/`}>
                  LinkedIn
                </a>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile.png/" }) {
      childImageSharp {
        fixed(width: 74, height: 74) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        introduction
        social {
          twitter
          github
          medium
          facebook
          linkedin
          portfolio
        }
      }
    }
  }
`
