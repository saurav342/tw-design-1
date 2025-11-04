const Footer = () => (
  <footer className="relative overflow-hidden bg-[#110720] text-white">
    <div className="pointer-events-none absolute -top-32 left-10 h-72 w-72 rounded-full bg-[#ff4fa3]/30 blur-[160px]" />
    <div className="pointer-events-none absolute -bottom-32 right-10 h-80 w-80 rounded-full bg-[#34d399]/30 blur-[180px]" />
    <div className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
        <div className="max-w-md space-y-6">
          <span className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-white/70">
            HSR Layout • Bengaluru
          </span>
          <h3 className="text-3xl font-semibold leading-tight">
            LaunchAndLift is your vibrant partner for fundraising momentum.
          </h3>
          <p className="text-sm text-white/75">
            From our studio in HSR Layout we choreograph capital raises, connect founders with aligned investors, and keep the
            energy high with pink, purple, and green optimism.
          </p>
          <div className="space-y-1 text-sm text-white/60">
            <p>HSR Layout, Sector 2</p>
            <p>Bengaluru, Karnataka 560102</p>
          </div>
        </div>

        <div className="grid flex-1 gap-10 text-sm text-white/70 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.35em] text-[#ffb7d8]">Quick links</h4>
            <ul className="mt-4 space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'For Founders', href: '/founders' },
                { label: 'For Investors', href: '/investors' },
                { label: 'Portfolio', href: '/portfolio' },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="transition hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.35em] text-[#c8bbff]">Resources</h4>
            <ul className="mt-4 space-y-3">
              {[
                { label: 'Founder Playbooks', href: '/resources' },
                { label: 'Investor Updates', href: '/portfolio' },
                { label: 'Events in HSR', href: '/founders' },
                { label: 'Success Stories', href: '/portfolio' },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="transition hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.35em] text-[#9feec9]">Connect</h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="mailto:hello@launchandlift.com" className="transition hover:text-white">
                  hello@launchandlift.com
                </a>
              </li>
              <li>
                <a href="tel:+918041234500" className="transition hover:text-white">
                  +91 804 123 4500
                </a>
              </li>
              <li>Mon - Fri, 9:30am - 7:00pm IST</li>
              <li>Meetups every second Thursday @ HSR Innovation Hub</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div className="border-t border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-xs text-white/60 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>&copy; {new Date().getFullYear()} LaunchAndLift. Crafted with vibrant intent in HSR Layout, Bengaluru.</p>
        <p className="uppercase tracking-[0.35em] text-white/70">Pink • Purple • Green energy for every raise.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
