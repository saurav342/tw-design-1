import { Users2, Heart, CheckCircle2, Calendar } from 'lucide-react';
import { Button } from './ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { MatchScoreBadge } from './MatchScoreBadge.jsx';
import { formatCurrency } from '../lib/formatters.js';
import { cn } from '../lib/utils.js';

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
    <Card className="border-white/20 bg-white/10 backdrop-blur-xl transition hover:scale-[1.02] hover:border-white/30 hover:bg-white/15 hover:shadow-2xl">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl text-white">{founder.startupName}</CardTitle>
              {isInPortfolio && (
                <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-semibold text-green-300 shadow-lg shadow-green-500/30">
                  <CheckCircle2 className="h-3 w-3" />
                  Portfolio
                </span>
              )}
              {isInterested && !isInPortfolio && (
                <span className="flex items-center gap-1 rounded-full bg-pink-500/20 px-2 py-0.5 text-xs font-semibold text-pink-300 shadow-lg shadow-pink-500/30">
                  <Heart className="h-3 w-3" />
                  Interested
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-300">{founder.headline}</p>
          </div>
          <MatchScoreBadge score={matchScore} />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="rounded-full border border-white/10 px-2 py-0.5">{founder.sector}</span>
          <span className="rounded-full border border-white/10 px-2 py-0.5">
            {founder.geography}
          </span>
          <span className="rounded-full border border-white/10 px-2 py-0.5">
            {founder.raiseStage}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-slate-200">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Raising</p>
            <p className="font-medium text-white">{formatCurrency(founder.raiseAmountUSD)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Team Size</p>
            <p className="font-medium text-white">{founder.teamSize} people</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Traction</p>
            <p>{founder.tractionSummary}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Founder</p>
            <p className="flex items-center gap-2 text-white">
              <Users2 className="h-4 w-4 text-indigo-300" />
              {founder.fullName}
            </p>
          </div>
        </div>

        {isInPortfolio && investmentAmount && (
          <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 shadow-lg shadow-green-500/20">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Your Investment</p>
                <p className="font-semibold text-green-400">{formatCurrency(investmentAmount)}</p>
              </div>
              {investmentDate && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Invested On</p>
                  <p className="flex items-center gap-1 font-medium text-slate-300">
                    <Calendar className="h-3 w-3" />
                    {formatDate(investmentDate)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <Button
          className={cn(
            'w-full font-semibold shadow-lg transition-all',
            isInterested && !isInPortfolio && 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 hover:shadow-pink-500/50',
            isInPortfolio && 'cursor-default bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/50'
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
            'Request Intro'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
