import type { ReactNode } from 'react';

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface StatTrend {
  value: string | number;
  direction?: TrendDirection;
  /**
   * By default: 'up' is positive (true), 'down' is negative (false).
   * For metrics where increases are undesirable (e.g. stockouts, spoilage),
   * set isPositive={false} when direction is 'up'.
   */
  isPositive?: boolean;
  /**
   * Contextual label, e.g. "vs last month", "vs baseline target"
   */
  label?: string;
}

export interface StatCardProps {
  /** Metric label / card title */
  title: string;
  /** Primary metric value */
  value: string | number;
  /** Secondary explanatory text or subtitle */
  description?: string;
  /** Trend comparison data */
  trend?: StatTrend;
  /** Optional icon component or SVG node */
  icon?: ReactNode;
  /** Optional status badge text */
  badge?: string;
  /** Optional custom CSS classes */
  className?: string;
}

export default function StatCard({
  title,
  value,
  description,
  trend,
  icon,
  badge,
  className = '',
}: StatCardProps) {
  const getTrendClasses = (direction: TrendDirection = 'neutral', isPositive?: boolean) => {
    // If isPositive is explicitly specified, use it. Otherwise, infer from direction.
    const positive = isPositive !== undefined ? isPositive : direction === 'up';

    if (direction === 'neutral') {
      return {
        pill: 'text-slate-600 bg-slate-100 border-slate-200',
        text: 'text-slate-600',
      };
    }

    if (positive) {
      return {
        pill: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        text: 'text-emerald-600',
      };
    }

    return {
      pill: 'text-rose-700 bg-rose-50 border-rose-200',
      text: 'text-rose-600',
    };
  };

  const trendStyles = trend ? getTrendClasses(trend.direction, trend.isPositive) : null;

  return (
    <article
      aria-label={title}
      className={`bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition-colors flex flex-col justify-between ${className}`.trim()}
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <h3
            className="text-xs font-semibold uppercase tracking-wider text-slate-500 truncate"
            title={title}
          >
            {title}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            {badge && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                {badge}
              </span>
            )}
            {icon && (
              <div
                className="w-9 h-9 rounded-md bg-slate-50 border border-slate-200 text-slate-600 flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                {icon}
              </div>
            )}
          </div>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
            {value}
          </span>
        </div>

        {description && (
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {trend && trendStyles && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center flex-wrap gap-2 text-xs">
          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[11px] font-semibold ${trendStyles.pill}`}
            aria-label={`Trend: ${trend.value} ${trend.label ?? ''}`}
          >
            {trend.direction === 'up' && (
              <svg
                className="w-3 h-3 mr-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            )}
            {trend.direction === 'down' && (
              <svg
                className="w-3 h-3 mr-0.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            {trend.direction === 'neutral' && (
              <span className="mr-1 text-[12px] leading-none" aria-hidden="true">&bull;</span>
            )}
            <span>{trend.value}</span>
          </span>

          {trend.label && (
            <span className="text-slate-500 text-[11px] truncate">
              {trend.label}
            </span>
          )}
        </div>
      )}
    </article>
  );
}
