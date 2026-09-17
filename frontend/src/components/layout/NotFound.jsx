const NotFound = () => {
  return (
    <div className="min-h-screen bg-surface p-8 text-on-surface">
      <h1 className="headline-md font-bold text-primary mb-4">404 - Not Found</h1>
      <p className="text-on-surface-variant mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="btn-primary">Go to Home</Link>
    </div>
  );
};

export default NotFound;