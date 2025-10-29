import SectionHeader from '../components/SectionHeader';
import { resources } from '../data/content';

const Resources = () => (
  <div className="mx-auto max-w-6xl space-y-12 px-4 py-12 lg:px-0">
    <SectionHeader
      eyebrow="Resources"
      title="Insights from LaunchAndLift"
      description="Research, playbooks, and operator-led sessions to help investors and founders scale responsibly."
    />
    <div className="grid gap-6 md:grid-cols-2">
      {resources.map((resource) => (
        <div key={resource.title} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200">
          <div className="inline-flex rounded-full bg-night-soft px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sunbeam">
            {resource.type}
          </div>
          <h3 className="mt-4 text-xl font-semibold text-night">{resource.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{resource.description}</p>
          <a
            href={resource.link}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sprout hover:text-mint"
          >
            Access resource
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 12h13.5m0 0-5.25-5.25M18.75 12l-5.25 5.25" />
            </svg>
          </a>
        </div>
      ))}
    </div>
  </div>
);

export default Resources;
