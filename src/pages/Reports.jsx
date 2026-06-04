import { useState } from 'react'
import { TrendingUp, TrendingDown, BarChart2, DollarSign } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

const MONTHLY = [
  { month: 'Jan', income: 5200, expense: 3100 },
  { month: 'Feb', income: 4800, expense: 2900 },
  { month: 'Mar', income: 6100, expense: 3800 },
  { month: 'Apr', income: 5600, expense: 3200 },
  { month: 'May', income: 7000, expense: 4100 },
  { month: 'Jun', income: 6400, expense: 3600 },
]

const CATEGORIES = [
  { label: 'Housing', amount: 1400, pct: 42, color: '#F97316' },
  { label: 'Food', amount: 930, pct: 28, color: '#3B82F6' },
  { label: 'Transport', amount: 600, pct: 18, color: '#A855F7' },
  { label: 'Misc', amount: 400, pct: 12, color: '#6B7280' },
]

function Bar({ income, expense }) {
  const max = 8000
  return (
    <div className="flex items-end gap-1 h-28">
      <div
        className="w-4 rounded-t bg-primary/70"
        style={{ height: `${(income / max) * 100}%` }}
      />
      <div
        className="w-4 rounded-t bg-blue-500/60"
        style={{ height: `${(expense / max) * 100}%` }}
      />
    </div>
  )
}

export default function Reports() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const totalIncome = MONTHLY.reduce((s, m) => s + m.income, 0)
  const totalExpense = MONTHLY.reduce((s, m) => s + m.expense, 0)
  const netSavings = totalIncome - totalExpense

  return (
    <div className="flex h-screen bg-bg-main overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 px-4 lg:px-8 py-6 space-y-6">
          <div>
            <h1 className="text-text-main text-2xl font-bold">Reports</h1>
            <p className="text-text-secondary text-sm mt-1">Financial overview for the last 6 months</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-bg-card border border-border-subtle rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-green-400" />
                <span className="text-text-secondary text-xs font-medium uppercase tracking-wider">Total Income</span>
              </div>
              <p className="text-text-main text-2xl font-bold">${totalIncome.toLocaleString()}</p>
            </div>
            <div className="bg-bg-card border border-border-subtle rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown size={16} className="text-red-400" />
                <span className="text-text-secondary text-xs font-medium uppercase tracking-wider">Total Expenses</span>
              </div>
              <p className="text-text-main text-2xl font-bold">${totalExpense.toLocaleString()}</p>
            </div>
            <div className="bg-bg-card border border-border-subtle rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={16} className="text-primary" />
                <span className="text-text-secondary text-xs font-medium uppercase tracking-wider">Net Savings</span>
              </div>
              <p className="text-text-main text-2xl font-bold">${netSavings.toLocaleString()}</p>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-text-main font-semibold">Monthly Overview</h2>
              <div className="flex items-center gap-4 text-xs text-text-secondary">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-primary/70 inline-block" />Income</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500/60 inline-block" />Expenses</span>
              </div>
            </div>
            <div className="flex items-end justify-around">
              {MONTHLY.map((m) => (
                <div key={m.month} className="flex flex-col items-center gap-2">
                  <Bar income={m.income} expense={m.expense} />
                  <span className="text-text-secondary text-xs">{m.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Spending by Category */}
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-6">
            <h2 className="text-text-main font-semibold mb-4">Spending by Category</h2>
            <div className="space-y-4">
              {CATEGORIES.map((c) => (
                <div key={c.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-text-main text-sm">{c.label}</span>
                    <span className="text-text-secondary text-sm">${c.amount} <span className="text-xs">({c.pct}%)</span></span>
                  </div>
                  <div className="h-2 rounded-full bg-bg-main overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${c.pct}%`, backgroundColor: c.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
