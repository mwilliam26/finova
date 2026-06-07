import { useState } from 'react'
import { Target, Plus, TrendingUp } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { useLang } from '../contexts/LangContext'

const GOALS = [
  { id: 1, name: 'Emergency Fund', target: 10000, current: 6200, color: '#F97316' },
  { id: 2, name: 'Vacation to Japan', target: 5000, current: 1800, color: '#3B82F6' },
  { id: 3, name: 'New Laptop', target: 2500, current: 2100, color: '#A855F7' },
  { id: 4, name: 'Investment Portfolio', target: 50000, current: 12400, color: '#10B981' },
]

function GoalCard({ goal }) {
  const { t } = useLang()
  const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100)
  const remaining = goal.target - goal.current

  return (
    <div className="bg-bg-card border border-border-subtle rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${goal.color}20` }}>
            <Target size={18} style={{ color: goal.color }} />
          </div>
          <div>
            <p className="text-text-main text-sm font-semibold">{goal.name}</p>
            <p className="text-text-secondary text-xs">${goal.current.toLocaleString()} {t('saved of')} ${goal.target.toLocaleString()}</p>
          </div>
        </div>
        <span className="text-text-main text-sm font-bold">{pct}%</span>
      </div>

      <div className="h-2 rounded-full bg-bg-main overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: goal.color }}
        />
      </div>

      <p className="text-text-secondary text-xs">
        ${remaining.toLocaleString()} {t('remaining')}
      </p>
    </div>
  )
}

export default function Goals() {
  const { t } = useLang()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const totalSaved = GOALS.reduce((s, g) => s + g.current, 0)
  const totalTarget = GOALS.reduce((s, g) => s + g.target, 0)
  const overallPct = Math.round((totalSaved / totalTarget) * 100)

  return (
    <div className="flex h-screen bg-bg-main overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar onMenuOpen={() => setSidebarOpen(true)} onAddTransaction={() => {}} />

        <main className="flex-1 px-4 lg:px-8 py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-text-main text-2xl font-bold">{t('Goals')}</h1>
              <p className="text-text-secondary text-sm mt-1">{t('Track your financial goals')}</p>
            </div>
            <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              <Plus size={14} />
              {t('New Goal')}
            </button>
          </div>

          {/* Overall Progress */}
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-text-main font-semibold">{t('Overall Progress')}</p>
                <p className="text-text-secondary text-xs">${totalSaved.toLocaleString()} {t('saved of')} ${totalTarget.toLocaleString()}</p>
              </div>
              <span className="ml-auto text-text-main text-xl font-bold">{overallPct}%</span>
            </div>
            <div className="h-3 rounded-full bg-bg-main overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>

          {/* Goals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GOALS.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
