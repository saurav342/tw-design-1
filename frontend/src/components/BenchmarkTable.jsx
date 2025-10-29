import { Button } from './ui/button.jsx';
import { Textarea } from './ui/textarea.jsx';

export const BenchmarkTable = ({ rows, founderNotes, onChangeNote, onSave, isDisabled }) => (
  <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
    <div className="overflow-auto">
      <table className="min-w-full divide-y divide-white/10 text-sm text-slate-200">
        <thead className="bg-white/10 text-xs uppercase tracking-[0.2em] text-slate-300">
          <tr>
            <th className="px-4 py-3 text-left">Metric</th>
            <th className="px-4 py-3 text-left">Industry Standard</th>
            <th className="px-4 py-3 text-left">Your Startup</th>
            <th className="px-4 py-3 text-left">Your Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((row) => (
            <tr key={row.id} className="transition hover:bg-white/5">
              <td className="px-4 py-4 font-medium text-white">{row.metric}</td>
              <td className="px-4 py-4 text-slate-300">{row.industryStandard}</td>
              <td className="px-4 py-4 text-indigo-200">{row.startupValue}</td>
              <td className="px-4 py-4">
                <Textarea
                  placeholder="Leave context for investors..."
                  value={founderNotes[row.id] ?? ''}
                  onChange={(event) => onChangeNote(row.id, event.target.value)}
                  disabled={isDisabled}
                  className="min-h-[96px] resize-none border-white/10 bg-black/20"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="flex justify-end border-t border-white/10 bg-black/20 px-4 py-4">
      <Button onClick={onSave} disabled={isDisabled}>
        Save My Remarks
      </Button>
    </div>
  </div>
);
