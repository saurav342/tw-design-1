import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { resources } from '../data/content';
import { highlightBrandName } from '../lib/brandHighlight';
import {
  BookOpen,
  FileText,
  Video,
  BarChart3,
  ArrowRight,
  Calendar,
  Clock,
  Filter,
  X,
  Search,
  TrendingUp,
} from 'lucide-react';

const MotionDiv = motion.div;
const MotionSection = motion.section;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.3 },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const typeIcons = {
  Guide: BookOpen,
  Report: BarChart3,
  Article: FileText,
  Webinar: Video,
  Toolkit: FileText,
  'Case Study': TrendingUp,
  Playbook: BookOpen,
};

const typeColors = {
  Guide: 'from-[#8b5cf6] to-[#a78bfa]',
  Report: 'from-[#ff4fa3] to-[#ff6bb3]',
  Article: 'from-[#34d399] to-[#6ee7b7]',
  Webinar: 'from-[#8b5cf6] to-[#ff4fa3]',
  Toolkit: 'from-[#34d399] to-[#8b5cf6]',
  'Case Study': 'from-[#ff4fa3] to-[#34d399]',
  Playbook: 'from-[#8b5cf6] to-[#34d399]',
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const Resources = () => {
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Sort resources by date (newest first)
  const sortedResources = useMemo(() => {
    return [...resources].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, []);

  // Get unique categories and types
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(resources.map((r) => r.category))];
    return cats.sort();
  }, []);

  const types = useMemo(() => {
    const typs = ['All', ...new Set(resources.map((r) => r.type))];
    return typs.sort();
  }, []);

  // Filter resources
  const filteredResources = useMemo(() => {
    return sortedResources.filter((resource) => {
      const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
      const matchesType = selectedType === 'All' || resource.type === selectedType;
      const matchesSearch =
        searchQuery === '' ||
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesType && matchesSearch;
    });
  }, [sortedResources, selectedCategory, selectedType, searchQuery]);

  // Determine how many to show
  const initialCount = 12;
  const visibleResources = showAll ? filteredResources : filteredResources.slice(0, initialCount);
  const hasMore = filteredResources.length > initialCount;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fff0fb] via-[#f5f0ff] to-[#f0fff6]">
      {/* Animated Background Elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <MotionDiv
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-[#ff4fa3]/20 to-[#8b5cf6]/20 blur-3xl"
        />
        <MotionDiv
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-[#34d399]/20 to-[#8b5cf6]/20 blur-3xl"
        />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <MotionSection
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="relative mx-auto max-w-7xl px-4 pt-24 pb-12 lg:px-8 lg:pt-32 lg:pb-16"
        >
          <div className="text-center space-y-6 mb-12">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#f9e4ff] to-[#f0e9ff] px-5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#8b5cf6] shadow-sm mb-4">
                Resources & Insights
              </span>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-4xl font-semibold text-[#1a1030] sm:text-5xl lg:text-6xl">
                Learn from {highlightBrandName('Launch & Lift')}
              </h1>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-lg leading-relaxed text-[#3b2a57] max-w-3xl mx-auto sm:text-xl">
                Research, playbooks, guides, and insights to help investors and founders scale responsibly and raise capital faster.
              </p>
            </MotionDiv>
          </div>

          {/* Search Bar */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#8b5cf6]" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-white/60 bg-white/80 backdrop-blur-sm text-[#1a1030] placeholder-[#8b5cf6]/50 focus:outline-none focus:border-[#8b5cf6]/50 focus:ring-2 focus:ring-[#8b5cf6]/20 transition-all shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#8b5cf6] hover:text-[#ff4fa3] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </MotionDiv>

          {/* Filters */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-[#8b5cf6]" />
              <span className="text-sm font-semibold text-[#3b2a57]">Filter:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-[#ff4fa3] to-[#8b5cf6] text-white shadow-lg'
                      : 'bg-white/80 text-[#8b5cf6] border border-[#8b5cf6]/30 hover:border-[#8b5cf6]/50 hover:shadow-md'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedType === type
                      ? 'bg-gradient-to-r from-[#8b5cf6] to-[#34d399] text-white shadow-lg'
                      : 'bg-white/80 text-[#34d399] border border-[#34d399]/30 hover:border-[#34d399]/50 hover:shadow-md'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </MotionDiv>

          {/* Results Count */}
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="text-center mb-8"
          >
            <p className="text-sm text-[#3b2a57]">
              Showing <span className="font-semibold text-[#8b5cf6]">{filteredResources.length}</span> resource
              {filteredResources.length !== 1 ? 's' : ''}
              {(selectedCategory !== 'All' || selectedType !== 'All' || searchQuery) && (
                <span>
                  {' '}
                  (
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedType('All');
                      setSearchQuery('');
                    }}
                    className="text-[#8b5cf6] hover:text-[#ff4fa3] underline"
                  >
                    clear filters
                  </button>
                  )
                </span>
              )}
            </p>
          </MotionDiv>
        </MotionSection>

        {/* Resources Grid */}
        <MotionSection
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="relative mx-auto max-w-7xl px-4 pb-20 lg:px-8"
        >
          {filteredResources.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-[#3b2a57]">No resources found. Try adjusting your filters.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
                <AnimatePresence mode="wait">
                  {visibleResources.map((resource) => {
                    const IconComponent = typeIcons[resource.type] || FileText;
                    const gradient = typeColors[resource.type] || 'from-[#8b5cf6] to-[#a78bfa]';

                    return (
                      <MotionDiv
                        key={resource.id}
                        variants={fadeUp}
                        layout
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/95 p-6 shadow-[0_18px_55px_rgba(139,92,246,0.12)] backdrop-blur transition-all hover:shadow-[0_24px_70px_rgba(139,92,246,0.2)]"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                        <div className="relative">
                          {/* Type Badge */}
                          <div className="flex items-center justify-between mb-4">
                            <div
                              className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${gradient} px-3 py-1.5 text-xs font-semibold text-white shadow-sm`}
                            >
                              <IconComponent className="h-3 w-3" />
                              {resource.type}
                            </div>
                            {resource.featured && (
                              <span className="text-xs font-semibold text-[#ff4fa3] bg-[#ff4fa3]/10 px-2 py-1 rounded-full">
                                Featured
                              </span>
                            )}
                          </div>

                          {/* Category */}
                          <span className="inline-block text-xs font-semibold text-[#8b5cf6] mb-3">
                            {resource.category}
                          </span>

                          {/* Title */}
                          <h3 className="text-xl font-semibold text-[#1a1030] mb-3 leading-tight group-hover:text-[#8b5cf6] transition-colors">
                            {resource.title}
                          </h3>

                          {/* Description */}
                          <p className="text-sm text-[#3b2a57] leading-relaxed mb-4 line-clamp-3">
                            {resource.description}
                          </p>

                          {/* Meta Information */}
                          <div className="flex items-center gap-4 text-xs text-[#3b2a57] mb-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(resource.date)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {resource.readTime}
                            </div>
                          </div>

                          {/* CTA */}
          <a
            href={resource.link}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#8b5cf6] hover:text-[#ff4fa3] transition-colors group/link"
                          >
                            Read more
                            <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
          </a>
        </div>
                      </MotionDiv>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Show More Button */}
              {hasMore && (
                <MotionDiv
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center"
                >
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="group inline-flex items-center gap-2 rounded-2xl border-2 border-[#8b5cf6]/30 bg-white/80 px-8 py-4 text-sm font-semibold text-[#8b5cf6] transition-all duration-300 hover:border-[#ff4fa3]/50 hover:bg-gradient-to-r hover:from-[#ff4fa3]/10 hover:via-[#8b5cf6]/10 hover:to-[#34d399]/10 hover:shadow-lg hover:shadow-[#8b5cf6]/20 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/50 focus:ring-offset-2"
                  >
                    <span>{showAll ? 'Show Less' : `Show ${filteredResources.length - initialCount} More Resources`}</span>
                    <motion.div
                      animate={{ rotate: showAll ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </button>
                </MotionDiv>
              )}
            </>
          )}
        </MotionSection>
    </div>
  </div>
);
};

export default Resources;
