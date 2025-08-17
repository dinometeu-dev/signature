import React from 'react';

const OpenSlideContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return <div ref={ref} {...props}></div>;
});

OpenSlideContent.displayName = 'OpenSlideContent';
export default OpenSlideContent;
