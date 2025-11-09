import { Users2, Heart, CheckCircle2, Calendar, MapPin, TrendingUp } from 'lucide-react';
import { Button } from './ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { MatchScoreBadge } from './MatchScoreBadge.jsx';
import { formatCurrency } from '../lib/formatters.js';
import { cn } from '../lib/utils.js';
import { motion } from 'framer-motion';

export const StartupCard = ({
  founder,
  matchScore,
  onRequestIntro,
  isInterested = false,
  isInPortfolio = false,
  investmentAmount,
  investmentDate,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-2 border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gray-300">
        <CardHeader className="flex flex-col gap-3 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <CardTitle className="text-xl text-gray-900 font-bold">{founder.startupName}</CardTitle>
                {isInPortfolio && (
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="h-3 w-3" />
                    Portfolio
                  </span>
                )}
                {isInterested && !isInPortfolio && (
                  <span className="flex items-center gap-1.5 rounded-full bg-pink-100 px-2.5 py-1 text-xs font-semibold text-pink-700 border border-pink-200">
                    <Heart className="h-3 w-3" />
                    Interested
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{founder.headline}</p>
            </div>
            <div className="flex-shrink-0">
              <MatchScoreBadge score={matchScore} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 border border-blue-200">
              <TrendingUp className="h-3 w-3" />
              {founder.sector}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700 border border-gray-200">
              <MapPin className="h-3 w-3" />
              {founder.geography}
            </span>
            <span className="inline-flex items-center rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 border border-purple-200">
              {founder.raiseStage}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-gray-50 p-3 border border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Raising</p>
              <p className="font-bold text-gray-900 text-lg">{formatCurrency(founder.raiseAmountUSD)}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 border border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Team Size</p>
              <p className="font-bold text-gray-900 text-lg">{founder.teamSize} people</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 border border-gray-100 col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Traction</p>
              <p className="text-sm text-gray-700 leading-relaxed">{founder.tractionSummary}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 border border-gray-100 col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Founder</p>
              <p className="flex items-center gap-2 text-gray-900 font-medium">
                <Users2 className="h-4 w-4 text-blue-600" />
                {founder.fullName}
              </p>
            </div>
          </div>

          {isInPortfolio && investmentAmount && (
            <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-4 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 mb-1">Your Investment</p>
                  <p className="font-bold text-emerald-900 text-lg">{formatCurrency(investmentAmount)}</p>
                </div>
                {investmentDate && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 mb-1">Invested On</p>
                    <p className="flex items-center gap-1.5 font-medium text-emerald-800">
                      <Calendar className="h-4 w-4" />
                      {formatDate(investmentDate)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <Button
            className={cn(
              'w-full font-semibold shadow-sm transition-all duration-200 h-11',
              isInterested && !isInPortfolio && 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 hover:shadow-md hover:shadow-pink-500/30 text-white',
              isInPortfolio && 'cursor-default bg-gradient-to-r from-emerald-500 to-green-500 text-white opacity-75',
              !isInterested && !isInPortfolio && 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 hover:shadow-md hover:shadow-blue-500/30 text-white'
            )}
            onClick={isInPortfolio ? undefined : onRequestIntro}
            disabled={isInPortfolio}
          >
            {isInPortfolio ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                In Your Portfolio
              </>
            ) : isInterested ? (
              <>
                <Heart className="mr-2 h-4 w-4" />
                Intro Requested
              </>
            ) : (
              <>
                <Heart className="mr-2 h-4 w-4" />
                Request Intro
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
