import { Link } from 'react-router-dom';
import { Mail, Linkedin, Twitter, Github, ArrowRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: {
      title: 'Platform',
      links: [
        { label: 'For Founders', to: '/founders' },
        { label: 'For Investors', to: '/investors' },
        { label: 'Portfolio', to: '/portfolio' },
        { label: 'Resources', to: '/resources' },
      ],
    },
    company: {
      title: 'Company',
      links: [
        { label: 'About Us', to: '/about' },
        { label: 'How It Works', to: '/how-it-works' },
        { label: 'Success Stories', to: '/portfolio' },
        { label: 'Careers', to: '/careers' },
      ],
    },
    support: {
      title: 'Support',
      links: [
        { label: 'Help Center', to: '/help' },
        { label: 'Contact Us', to: '/contact' },
        { label: 'FAQ', to: '/#faq' },
        { label: 'Documentation', to: '/docs' },
      ],
    },
    legal: {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'Terms of Service', to: '/terms' },
        { label: 'Cookie Policy', to: '/cookies' },
        { label: 'Security', to: '/security' },
      ],
    },
  };

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://linkedin.com/company/launchandlift',
      ariaLabel: 'Visit Launch & Lift on LinkedIn',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: 'https://twitter.com/launchandlift',
      ariaLabel: 'Follow Launch & Lift on Twitter',
    },
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/launchandlift',
      ariaLabel: 'Visit Launch & Lift on GitHub',
    },
    {
      name: 'Email',
      icon: Mail,
      href: 'mailto:support@launchandlift.com',
      ariaLabel: 'Email Launch & Lift',
    },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-white via-gray-50/50 to-gray-100/80 border-t border-gray-200/60">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-gradient-to-br from-[#8b5cf6]/5 to-transparent blur-3xl" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-gradient-to-br from-[#ff4fa3]/5 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 group mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#ff4fa3] shadow-lg shadow-[#8b5cf6]/20 group-hover:shadow-xl group-hover:shadow-[#8b5cf6]/30 transition-all duration-300">
                <span className="text-2xl">🚀</span>
              </div>
              <span className="text-2xl font-bold text-[#8b5cf6] group-hover:text-[#7c3aed] transition-colors">
                Launch & Lift
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-600 mb-6 max-w-sm">
              AI-powered infrastructure for modern startup fundraising. Connect founders with aligned investors and accelerate your path to funding.
            </p>
            
            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Stay Updated</h3>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#8b5cf6] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/20 transition-all"
                />
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#8b5cf6] to-[#ff4fa3] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#8b5cf6]/25 hover:shadow-lg hover:shadow-[#8b5cf6]/30 hover:from-[#7c3aed] hover:to-[#e91e63] transition-all duration-200"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Get the latest fundraising insights and platform updates.
              </p>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={key} className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="text-sm text-gray-600 hover:text-[#8b5cf6] transition-colors duration-200 inline-flex items-center gap-1.5 group"
                      >
                        <span>{link.label}</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 -translate-x-1 transition-all duration-200" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mt-16 pt-8 border-t border-gray-200/60">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Copyright */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
              <p className="text-sm text-gray-600">
                &copy; {currentYear} <span className="font-semibold text-[#8b5cf6]">Launch & Lift</span>. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>Made with ❤️ for founders</span>
                <span className="hidden sm:inline">•</span>
                <span>San Francisco, CA</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:inline">
                Follow Us
              </span>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.ariaLabel}
                      className="group flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 shadow-sm transition-all duration-200 hover:border-[#8b5cf6] hover:bg-[#8b5cf6] hover:text-white hover:shadow-md hover:shadow-[#8b5cf6]/20"
                    >
                      <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
