import React, { useMemo } from 'react'

import { ThumbnailContainer } from '../thumbnail-container'
import { ThumbnailItem } from '../thumbnail-item'
import { CATEGORY_TYPE, TAG_TYPE } from '../../constants'

export const Contents = ({ posts, countOfInitialPost, count, category, tag }) => {
  const refinedPosts = useMemo(() => {
    const categoryPosts = posts
      .filter(
        ({ node }) =>
          category === CATEGORY_TYPE.ALL ||
          node.frontmatter.category === category
      )
      .slice(0, count * countOfInitialPost);
    if (tag === TAG_TYPE.ALL) return categoryPosts;
    return categoryPosts.filter(({ node }) => node.frontmatter.tag === tag).slice(0, count * countOfInitialPost);
  })

  return (
    <ThumbnailContainer>
      {refinedPosts.map(({ node }, index) => (
        <ThumbnailItem node={node} key={`item_${index}`} />
      ))}
    </ThumbnailContainer>
  )
}
