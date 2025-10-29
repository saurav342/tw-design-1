import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 bg-night-soft/60 px-4 py-16 text-center">
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sprout">
        Page not found
      </p>
      <h1 className="text-4xl font-semibold text-night">We couldn’t find that page.</h1>
      <p className="text-sm text-slate-600">
        The content you’re looking for may have been moved. Return home or explore our resources.
      </p>
    </div>
    <div className="flex flex-wrap justify-center gap-4">
      <Link to="/" className="rounded-full bg-blossom px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-[0_28px_75px_rgba(255,79,154,0.35)] hover:bg-royal">
        Back to home
      </Link>
      <Link to="/resources" className="rounded-full border border-sprout px-6 py-3 text-sm font-semibold uppercase tracking-wide text-sprout hover:border-sunbeam hover:text-sunbeam">
        Explore resources
      </Link>
    </div>
  </div>
);

export default NotFound;
