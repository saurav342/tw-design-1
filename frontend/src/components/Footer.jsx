const Footer = () => (
  <footer className="bg-night text-white">
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 lg:flex-row lg:items-start lg:justify-between lg:px-8">
      <div className="max-w-sm space-y-4">
        <h3 className="font-display text-2xl font-semibold text-mint">LaunchAndLift</h3>
        <p className="text-sm text-slate-200">
          LaunchAndLift accelerates private market growth by pairing visionary founders with long-term capital, operational
          expertise, and a supportive ecosystem built for scale.
        </p>
        <div className="text-xs uppercase tracking-wide text-slate-300">
          1240 Market Street, Suite 500<br />
          San Francisco, CA 94102
        </div>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-8 text-sm sm:grid-cols-3">
        <div>
          <h4 className="font-semibold text-mint">Company</h4>
          <ul className="mt-3 space-y-2 text-slate-300">
            <li>
              <a href="#mission" className="hover:text-mint">
                Mission
              </a>
            </li>
            <li>
              <a href="#ecosystem" className="hover:text-mint">
                Ecosystem
              </a>
            </li>
            <li>
              <a href="#portfolio" className="hover:text-mint">
                Portfolio
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-mint">Legal</h4>
          <ul className="mt-3 space-y-2 text-slate-300">
            <li>
              <a href="#terms" className="hover:text-mint">
                Terms &amp; Conditions
              </a>
            </li>
            <li>
              <a href="#privacy" className="hover:text-mint">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#ethics" className="hover:text-mint">
                Ethics &amp; Compliance
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-mint">Contact</h4>
          <ul className="mt-3 space-y-2 text-slate-300">
            <li>
              <a href="mailto:hello@launchandlift.com" className="hover:text-mint">
                hello@launchandlift.com
              </a>
            </li>
            <li>
              <a href="tel:+14155551234" className="hover:text-mint">
                (415) 555-1234
              </a>
            </li>
            <li>
              <span>Mon–Fri, 9am–6pm PT</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div className="border-t border-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-slate-400 lg:flex-row lg:px-8">
        <p>&copy; {new Date().getFullYear()} LaunchAndLift. All rights reserved.</p>
        <p className="uppercase tracking-wide">Built for resilient growth in private markets.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
