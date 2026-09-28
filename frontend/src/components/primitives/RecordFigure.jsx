import React from 'react';
import ExpandableImage from './ExpandableImage';
import SchematicPlate from './SchematicPlate';
import { resolveImage } from '../../utils/images';

/* A figure is either the record's own photograph or a plate drawn from the
   record's stack. There is no third state: a record always has a figure. */
const RecordFigure = ({
  project = {},
  figureNo = 'BK-PROD',
  expandable = false,
  compact = false,
  className = '',
  imageClassName = 'aspect-[16/9] w-full object-cover',
}) => {
  const src = resolveImage(project.image);

  if (!src) {
    return <SchematicPlate project={project} compact={compact} className={className} />;
  }

  if (!expandable) {
    return (
      <img
        src={src}
        alt={project.title ? `${project.title} interface` : 'Record figure'}
        loading="lazy"
        className={`${imageClassName} ${className}`}
      />
    );
  }

  return (
    <ExpandableImage
      src={src}
      alt={project.title ? `${project.title} interface` : 'Record figure'}
      caption={figureNo}
      className={imageClassName}
    />
  );
};

export default RecordFigure;
