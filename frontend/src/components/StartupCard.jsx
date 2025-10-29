import { Users2 } from 'lucide-react';
import { Button } from './ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { MatchScoreBadge } from './MatchScoreBadge.jsx';
import { formatCurrency } from '../lib/formatters.js';

export const StartupCard = ({ founder, matchScore, onRequestIntro }) => (
  <Card className="transition hover:border-white/20 hover:bg-white/10">
    <CardHeader className="flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-xl text-white">{founder.startupName}</CardTitle>
          <p className="text-sm text-slate-300">{founder.headline}</p>
        </div>
        <MatchScoreBadge score={matchScore} />
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span className="rounded-full border border-white/10 px-2 py-0.5">{founder.sector}</span>
        <span className="rounded-full border border-white/10 px-2 py-0.5">{founder.geography}</span>
        <span className="rounded-full border border-white/10 px-2 py-0.5">{founder.raiseStage}</span>
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

      <Button className="w-full" onClick={onRequestIntro}>
        Request Intro
      </Button>
    </CardContent>
  </Card>
);
