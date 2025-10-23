import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 bg-brand-muted/60 px-4 py-16 text-center">
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lagoon">
        Page not found
      </p>
      <h1 className="text-4xl font-semibold text-brand-dark">We couldn’t find that page.</h1>
      <p className="text-sm text-slate-600">
        The content you’re looking for may have been moved. Return home or explore our resources.
      </p>
    </div>
    <div className="flex flex-wrap justify-center gap-4">
      <Link to="/" className="rounded-full bg-blaze px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-blaze/40 hover:bg-sunset">
        Back to home
      </Link>
      <Link to="/resources" className="rounded-full border border-lagoon px-6 py-3 text-sm font-semibold uppercase tracking-wide text-lagoon hover:border-burnt hover:text-burnt">
        Explore resources
      </Link>
    </div>
  </div>
);

export default NotFound;
