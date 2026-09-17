import React from 'react';

const Container = ({ children, fluid }) => {
  const classes = fluid
    ? 'max-w-full mx-auto px-4'
    : 'max-w-container-max mx-auto px-gutter';

  return <div className={classes}>{children}</div>;
};

export default Container;