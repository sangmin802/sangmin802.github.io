import React, { useMemo } from 'react'
import { ThumbnailContainer } from '../thumbnail-container'
import { ThumbnailItem } from '../thumbnail-item'
import { CATEGORY_TYPE, TAG_TYPE } from '../../constants'

export const Contents = ({ posts, countOfInitialPost, count, category, tag }) => {
  const refinedPosts = useMemo(() => {
    if (tag === TAG_TYPE.ALL) return posts.filter(({ node }) => category === CATEGORY_TYPE.ALL || node.frontmatter.category === category).slice(0, count * countOfInitialPost);
    return posts.filter(({ node }) => node.frontmatter.tag === tag && node.frontmatter.category === category).slice(0, count * countOfInitialPost);
  }, [category, tag]);

  return (
    <ThumbnailContainer>
      {refinedPosts.map(({ node }, index) => (
        <ThumbnailItem node={node} key={`item_${index}`} />
      ))}
    </ThumbnailContainer>
  )
}