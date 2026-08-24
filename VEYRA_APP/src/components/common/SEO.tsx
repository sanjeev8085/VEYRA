import React from 'react';
import { MetaTags, MetaTagsProps } from '../seo/MetaTags';

export const SEO: React.FC<MetaTagsProps> = (props) => {
  return <MetaTags {...props} />;
};

export { MetaTags };
export type { MetaTagsProps };
