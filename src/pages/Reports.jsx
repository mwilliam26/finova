import { useState, useEffect, useMemo } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Loader2 } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { getTransactions, seedTransactions } from '../services/api'
import { useLang } from '../contexts/LangContext'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const CATEGORY_COLORS = ['#F97316', '#3B82F6', '#A855F7', '#10B981', '#6B7280', '#EF4444', '#F59E0B']

function Bar({ income, expense, max }) {
  return (
    <div className="flex items-end gap-1 h-28">
      <div
        className="w-4 rounded-t bg-primary/70 transition-all duration-700"
        style={{ height: `${max ? (income / max) * 100 : 0}%` }}
      />
      <div
        className="w-4 rounded-t bg-blue-500/60 transition-all duration-700"
        style={{ height: `${max ? (expense / max) * 100 : 0}%` }}
      />
    </div>
  )
}

export default function Reports() {
  const { t } = useLang()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    seedTransactions()
      .then(() => getTransactions())
      .then(({ data }) => setTransactions(data || []))
      .catch((err) => console.error('Failed to load transactions:', err))
      .finally(() => setLoading(false))
  }, [])

  const monthlyData = useMemo(() => {
    const monthMap = {}
    transactions.forEach((tx) => {
      const d = new Date(tx.date)
      if (isNaN(d)) return
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (!monthMap[key]) {
        monthMap[key] = { income: 0, expense: 0, monthNum: d.getMonth() }
      }
      if (tx.type === 'income' || tx.amount > 0) {
        monthMap[key].income += Math.abs(tx.amount)
      } else {
        monthMap[key].expense += Math.abs(tx.amount)
      }
    })
    return Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([, v]) => ({ month: MONTH_NAMES[v.monthNum], income: v.income, expense: v.expense }))
  }, [transactions])

  const categoryData = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense' || t.amount < 0)
    const byCategory = {}
    expenses.forEach((tx) => {
      byCategory[tx.category] = (byCategory[tx.category] || 0) + Math.abs(tx.amount)
    })
    const total = Object.values(byCategory).reduce((s, v) => s + v, 0)
    if (!total) return []
    return Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
      .map(([label, amount], i) => ({
        label,
        amount,
        pct: Math.round((amount / total) * 100),
        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      }))
  }, [transactions])

  const totalIncome = transactions
    .filter((t) => t.type === 'income' || t.amount > 0)
    .reduce((s, t) => s + Math.abs(t.amount), 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'expense' || t.amount < 0)
    .reduce((s, t) => s + Math.abs(t.amount), 0)

  const netSavings = totalIncome - totalExpense

  const barMax = Math.max(...monthlyData.flatMap((m) => [m.income, m.expense]), 1)

  const fmt = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(n))

  return (
    <div className="flex h-screen bg-bg-main overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuOpen={() => setSidebarOpen(true)} onAddTransaction={() => {}} />

        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 space-y-6">
          <div>
            <h1 className="text-text-main text-2xl font-bold">{t('Reports')}</h1>
            <p className="text-text-secondary text-sm mt-1">{t('Financial overview based on your transactions')}</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={28} className="animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-bg-card border border-border-subtle rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-green-400" />
                    <span className="text-text-secondary text-xs font-medium uppercase tracking-wider">{t('Total Income')}</span>
                  </div>
                  <p className="text-text-main text-2xl font-bold">{fmt(totalIncome)}</p>
                </div>
                <div className="bg-bg-card border border-border-subtle rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown size={16} className="text-red-400" />
                    <span className="text-text-secondary text-xs font-medium uppercase tracking-wider">{t('Total Expenses')}</span>
                  </div>
                  <p className="text-text-main text-2xl font-bold">{fmt(totalExpense)}</p>
                </div>
                <div className="bg-bg-card border border-border-subtle rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={16} className="text-primary" />
                    <span className="text-text-secondary text-xs font-medium uppercase tracking-wider">{t('Net Savings')}</span>
                  </div>
                  <p className={`text-2xl font-bold ${netSavings >= 0 ? 'text-text-main' : 'text-negative'}`}>
                    {netSavings < 0 ? '-' : ''}{fmt(netSavings)}
                  </p>
                </div>
              </div>

              {/* Bar Chart */}
              {monthlyData.length > 0 ? (
                <div className="bg-bg-card border border-border-subtle rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-text-main font-semibold">{t('Monthly Overview')}</h2>
                    <div className="flex items-center gap-4 text-xs text-text-secondary">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-primary/70 inline-block" />{t('Income')}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-blue-500/60 inline-block" />{t('Expenses')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-end justify-around">
                    {monthlyData.map((m) => (
                      <div key={m.month} className="flex flex-col items-center gap-2">
                        <Bar income={m.income} expense={m.expense} max={barMax} />
                        <span className="text-text-secondary text-xs">{m.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 flex items-center justify-center text-text-secondary text-sm h-40">
                  {t('No transaction data to display')}
                </div>
              )}

              {/* Spending by Category */}
              {categoryData.length > 0 && (
                <div className="bg-bg-card border border-border-subtle rounded-2xl p-6">
                  <h2 className="text-text-main font-semibold mb-4">{t('Spending by Category')}</h2>
                  <div className="space-y-4">
                    {categoryData.map((c) => (
                      <div key={c.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-text-main text-sm">{c.label}</span>
                          <span className="text-text-secondary text-sm">
                            {fmt(c.amount)} <span className="text-xs">({c.pct}%)</span>
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-bg-main overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${c.pct}%`, backgroundColor: c.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
