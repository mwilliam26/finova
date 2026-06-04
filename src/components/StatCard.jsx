import { TrendingUp, TrendingDown } from 'lucide-react'
import { useLang } from '../contexts/LangContext'

export default function StatCard({ title, value, trend, trendLabel, icon: Icon, color, loading }) {
  const { t } = useLang()
  if (loading) {
    return (
      <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-28 bg-bg-main rounded" />
          <div className="w-10 h-10 rounded-xl bg-bg-main" />
        </div>
        <div className="h-8 w-36 bg-bg-main rounded mb-2" />
        <div className="h-3 w-24 bg-bg-main rounded" />
      </div>
    )
  }

  const isPositive = trend >= 0
  const TrendIcon = isPositive ? TrendingUp : TrendingDown
  const trendColor = isPositive ? 'text-positive' : 'text-negative'

  return (
    <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 hover:border-primary/20 transition-colors animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <span className="text-text-secondary text-sm font-medium">{title}</span>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}18` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      <div className="text-2xl font-bold text-text-main mb-1.5">{value}</div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          <TrendIcon size={13} />
          <span>
            {Math.abs(trend).toFixed(1)}% {trendLabel || t('vs last month')}
          </span>
        </div>
      )}
    </div>
  )
}
