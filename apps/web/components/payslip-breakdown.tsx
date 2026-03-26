'use client'

interface PayslipResult {
  gross_dkk: number
  am_bidrag: number
  am_grundlag: number
  a_skat: number
  atp: number
  net_dkk: number
  breakdown: string[]
}

interface PayslipBreakdownProps {
  result: PayslipResult
}

function fmt(n: number): string {
  return n.toLocaleString('da-DK', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' kr.'
}

export function PayslipBreakdown({ result }: PayslipBreakdownProps) {
  const rows: { label: string; value: number; color?: string }[] = [
    { label: 'Bruttoløn', value: result.gross_dkk },
    { label: 'AM-bidrag (8%)', value: -result.am_bidrag, color: 'text-destructive' },
    { label: 'AM-grundlag', value: result.am_grundlag },
    { label: 'A-skat', value: -result.a_skat, color: 'text-destructive' },
    { label: 'ATP-bidrag', value: -result.atp, color: 'text-destructive' },
  ]

  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="font-semibold mb-4">Din lønseddel nedbrudt</h2>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div
            key={i}
            className={`flex justify-between text-sm py-2 ${
              i < rows.length - 1 ? 'border-b' : ''
            }`}
          >
            <span className="text-muted-foreground">{row.label}</span>
            <span className={`font-mono font-medium ${row.color ?? ''}`}>
              {row.value < 0 ? '−' : '+'} {fmt(Math.abs(row.value))}
            </span>
          </div>
        ))}
        <div className="flex justify-between items-center pt-3 border-t-2">
          <span className="font-semibold text-base">Nettoløn</span>
          <span className="font-mono font-bold text-lg text-bullaris-teal">
            {fmt(result.net_dkk)}
          </span>
        </div>
      </div>

      {result.breakdown.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs font-medium text-muted-foreground mb-2">Beregningsnotater</p>
          <ul className="space-y-1">
            {result.breakdown.map((note, i) => (
              <li key={i} className="text-xs text-muted-foreground">
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
