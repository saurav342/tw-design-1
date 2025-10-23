import PropTypes from 'prop-types';

const TeamGrid = ({ members }) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {members.map((member) => (
      <div key={member.name} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200">
        <div className="h-16 w-16 rounded-2xl bg-brand-muted" />
        <h3 className="mt-4 text-lg font-semibold text-brand-dark">{member.name}</h3>
        <p className="text-sm font-medium text-lagoon">{member.title}</p>
        <p className="mt-3 text-sm text-slate-600">{member.bio}</p>
        <a
          href={member.linkedin}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-burnt hover:text-blaze"
        >
          LinkedIn Profile
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M19 0H5C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM8.54 18.46H5.69V9.14h2.85v9.32zM7.11 7.9c-.91 0-1.65-.74-1.65-1.65S6.2 4.6 7.11 4.6s1.65.74 1.65 1.65-.74 1.65-1.65 1.65zM20.31 18.46h-2.85v-4.52c0-1.08-.02-2.47-1.51-2.47-1.51 0-1.74 1.18-1.74 2.39v4.6h-2.85V9.14h2.74v1.27h.04c.38-.72 1.32-1.48 2.73-1.48 2.92 0 3.46 1.92 3.46 4.41v5.12z" />
          </svg>
        </a>
      </div>
    ))}
  </div>
);

TeamGrid.propTypes = {
  members: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      bio: PropTypes.string.isRequired,
      linkedin: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default TeamGrid;
