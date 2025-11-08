import { Button } from './ui/button.jsx';
import { Textarea } from './ui/textarea.jsx';

export const BenchmarkTable = ({ rows, founderNotes, onChangeNote, onSave, isDisabled }) => (
  <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/85 shadow-[0_28px_100px_-60px_rgba(147,112,219,0.35)] backdrop-blur-sm">
    {/* Desktop Table View */}
    <div className="hidden md:block overflow-auto">
      <table className="min-w-full divide-y divide-night/10 text-sm text-night/80">
        <thead className="bg-white/70 text-xs uppercase tracking-[0.2em] text-night/50">
          <tr>
            <th className="px-4 py-3 text-left">Metric</th>
            <th className="px-4 py-3 text-left">Industry Standard</th>
            <th className="px-4 py-3 text-left">Your Startup</th>
            <th className="px-4 py-3 text-left">Your Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-night/10">
          {rows.map((row) => (
            <tr key={row.id} className="transition hover:bg-white/80">
              <td className="px-4 py-4 font-medium text-night">{row.metric}</td>
              <td className="px-4 py-4 text-night/70">{row.industryStandard}</td>
              <td className="px-4 py-4 text-royal">{row.startupValue}</td>
              <td className="px-4 py-4">
                <Textarea
                  placeholder="Leave context for investors..."
                  value={founderNotes[row.id] ?? ''}
                  onChange={(event) => onChangeNote(row.id, event.target.value)}
                  disabled={isDisabled}
                  className="min-h-[96px] resize-none border-night/10 bg-white/80 text-night placeholder:text-night/40 focus-visible:ring-royal focus-visible:ring-offset-2"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile Card View */}
    <div className="md:hidden divide-y divide-night/10">
      {rows.map((row) => (
        <div key={row.id} className="p-4 space-y-4">
          <div className="space-y-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-night/50 mb-1">
                Metric
              </div>
              <div className="font-medium text-night">{row.metric}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-night/50 mb-1">
                Industry Standard
              </div>
              <div className="text-night/70">{row.industryStandard}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-night/50 mb-1">
                Your Startup
              </div>
              <div className="text-royal font-medium">{row.startupValue}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-night/50 mb-2">
                Your Notes
              </div>
              <Textarea
                placeholder="Leave context for investors..."
                value={founderNotes[row.id] ?? ''}
                onChange={(event) => onChangeNote(row.id, event.target.value)}
                disabled={isDisabled}
                className="min-h-[96px] resize-none border-night/10 bg-white/80 text-night placeholder:text-night/40 focus-visible:ring-royal focus-visible:ring-offset-2 w-full"
              />
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="flex justify-end border-t border-white/60 bg-white/80 px-4 py-4">
      <Button
        onClick={onSave}
        disabled={isDisabled}
        className="shadow-[0_22px_60px_-30px_rgba(255,79,154,0.45)] w-full sm:w-auto min-h-[44px]"
      >
        Save My Remarks
      </Button>
    </div>
  </div>
);
