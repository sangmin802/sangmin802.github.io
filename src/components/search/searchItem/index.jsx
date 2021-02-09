import { Link } from 'gatsby';
import React from 'react';

export const SearchItem = ({ title, slug }) => {
  return (
    <Link to={slug}>
      <div>{title}</div>
    </Link>
  );
}