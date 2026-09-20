import React from 'react';

const Container = ({ children, fluid }) => {
  return (
    <div className={fluid ? 'mx-auto w-full px-gutter' : 'container-page'}>
      {children}
    </div>
  );
};

export default Container;