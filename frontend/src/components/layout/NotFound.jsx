import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../SEO';

const NotFound = () => {
  return (
    <div className="container-page flex flex-col items-start justify-center py-40">
      <SEO title="Not on record — 404" description="This file is not in the registry." noindex />
      <p className="file-index-sm">Search no. 404</p>
      <h1 className="mt-3 text-masthead font-semibold text-ink">Not on record</h1>
      <p className="mt-5 max-w-[58ch] text-body text-ink-muted">
        The file you asked for is not in this registry. It may have been
        moved, renamed, or never filed in the first place.
      </p>
      <Link to="/" className="btn btn-primary mt-8">
        Return to the index
      </Link>
    </div>
  );
};

export default NotFound;