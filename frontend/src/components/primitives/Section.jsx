import React from 'react';

const Section = ({ children, className }) => {
  return (
    <section className={`py-section ${className || ''}`}>
      {children}
    </section>
  );
};

export default Section;