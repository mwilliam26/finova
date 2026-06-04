import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet, TrendingUp, TrendingDown, RefreshCw, Plus } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'
import AddTransactionModal from '../components/AddTransactionModal'
import { getTransactions, seedTransactions } from '../services/api'
import axios from 'axios'
import { useLang } from '../contexts/LangContext'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const BAR_DATA = [
  { month: 'Jan', income: 5200, expense: 3100 },
  { month: 'Feb', income: 4800, expense: 2900 },
  { month: 'Mar', income: 6100, expense: 3800 },
  { month: 'Apr', income: 5600, expense: 3200 },
  { month: 'May', income: 7000, expense: 4100 },
  { month: 'Jun', income: 6400, expense: 3600 },
]

const DONUT_DATA = [
  { label: 'Housing', value: 42, color: '#F97316' },
  { label: 'Food', value: 28, color: '#3B82F6' },
  { label: 'Transport', value: 18, color: '#A855F7' },
  { label: 'Misc', value: 12, color: '#6B7280' },
]

function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  let offset = 0
  const r = 60, cx = 80, cy = 80, stroke = 20
  const circ = 2 * Math.PI * r

  return (
    <div className="flex items-center gap-6">
      <svg width="160" height="160" className="shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2A2A2A" strokeWidth={stroke} />
        {data.map((d, i) => {
          const pct = d.value / total
          const dash = pct * circ
          const seg = (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset * circ / 100 + circ / 4}
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
          )
          offset += d.value
          return seg
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" fill="#fff" fontSize="18" fontWeight="700">
          {total}%
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="#9CA3AF" fontSize="10">
          total
        </text>
      </svg>
      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-text-secondary text-xs">{d.label}</span>
            <span className="ml-auto text-text-main text-xs font-semibold">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function BarChart({ data }) {
  const max = Math.max(...data.flatMap((d) => [d.income, d.expense]))
  return (
    <div className="flex items-end gap-2 h-36">
      {data.map((d) => (
        <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex items-end gap-0.5 h-28">
            <div
              className="flex-1 bg-primary/80 rounded-t-sm transition-all duration-700"
              style={{ height: `${(d.income / max) * 100}%` }}
            />
            <div
              className="flex-1 bg-bg-main border border-border-subtle rounded-t-sm transition-all duration-700"
              style={{ height: `${(d.expense / max) * 100}%` }}
            />
          </div>
          <span className="text-text-secondary text-xs">{d.month}</span>
        </div>
      ))}
    </div>
  )
}

function ExchangeRates() {
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { t } = useLang()

  useEffect(() => {
    axios
      .get('https://open.er-api.com/v6/latest/BRL')
      .then(({ data }) => {
        setRates({
          USD: (1 / data.rates.USD).toFixed(4),
          EUR: (1 / data.rates.EUR).toFixed(4),
          GBP: (1 / data.rates.GBP).toFixed(4),
        })
      })
      .catch((err) => {
        console.error('Failed to fetch exchange rates:', err)
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [])

  const currencies = [
    { code: 'USD', flag: '🇺🇸', name: 'US Dollar' },
    { code: 'EUR', flag: '🇪🇺', name: 'Euro' },
    { code: 'GBP', flag: '🇬🇧', name: 'British Pound' },
  ]

  return (
    <div className="bg-bg-card border border-border-subtle rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-text-main font-semibold text-sm">{t('Exchange Rates')}</h3>
        <span className="text-text-secondary text-xs">{t('vs BRL')}</span>
      </div>
      <div className="space-y-3">
        {currencies.map(({ code, flag, name }) => (
          <div key={code} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">{flag}</span>
              <div>
                <p className="text-text-main text-sm font-medium">{code}</p>
                <p className="text-text-secondary text-xs">{name}</p>
              </div>
            </div>
            {loading ? (
              <div className="h-4 w-16 bg-bg-main rounded animate-pulse" />
            ) : error ? (
              <span className="text-text-secondary text-xs">{t('Unavailable')}</span>
            ) : (
              <span className="text-text-main text-sm font-semibold">
                R$ {rates[code]}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { t } = useLang()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalTab, setModalTab] = useState('expense')
  const [transactions, setTransactions] = useState([])
  const [loadingTx, setLoadingTx] = useState(true)

  useEffect(() => {
    seedTransactions().then(() => {
      getTransactions()
        .then(({ data }) => setTransactions(data || []))
        .catch((err) => console.error('Failed to load transactions:', err))
        .finally(() => setLoadingTx(false))
    })
  }, [])

  const openModal = (tab) => {
    setModalTab(tab)
    setModalOpen(true)
  }

  const totalBalance = transactions.reduce((s, t) => s + t.amount, 0)
  const monthlyIncome = transactions
    .filter((t) => t.type === 'income' || t.amount > 0)
    .reduce((s, t) => s + Math.abs(t.amount), 0)
  const monthlyExpenses = transactions
    .filter((t) => t.type === 'expense' || t.amount < 0)
    .reduce((s, t) => s + Math.abs(t.amount), 0)

  const fmt = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

  const recentTx = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)

  const CATEGORY_ICONS = {
    Housing: '🏠', Food: '🍔', Transport: '🚗', Healthcare: '💊',
    Entertainment: '🎮', Salary: '💼', Freelance: '💻', Investment: '📈', Misc: '📦',
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg-main">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuOpen={() => setSidebarOpen(true)} onAddTransaction={openModal} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title={t('Total Balance')}
              value={fmt(totalBalance)}
              trend={8.2}
              icon={Wallet}
              color="#F97316"
              loading={loadingTx}
            />
            <StatCard
              title={t('Monthly Income')}
              value={fmt(monthlyIncome)}
              trend={12.5}
              icon={TrendingUp}
              color="#22C55E"
              loading={loadingTx}
            />
            <StatCard
              title={t('Monthly Expenses')}
              value={fmt(monthlyExpenses)}
              trend={-3.1}
              icon={TrendingDown}
              color="#EF4444"
              loading={loadingTx}
            />
          </div>

          {/* Middle row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Bar chart */}
            <div className="lg:col-span-2 bg-bg-card border border-border-subtle rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-text-main font-semibold text-sm">{t('Monthly Comparison')}</h3>
                <div className="flex items-center gap-4 text-xs text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-primary inline-block" /> {t('Income')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-bg-main border border-border-subtle inline-block" /> {t('Expense')}
                  </span>
                </div>
              </div>
              <BarChart data={BAR_DATA} />
            </div>

            {/* Exchange rates */}
            <ExchangeRates />
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Recent transactions */}
            <div className="lg:col-span-2 bg-bg-card border border-border-subtle rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-text-main font-semibold text-sm">{t('Recent Transactions')}</h3>
                <button
                  onClick={() => navigate('/transactions')}
                  className="text-primary text-xs font-medium hover:text-primary-hover transition-colors"
                >
                  {t('View all')}
                </button>
              </div>
              {loadingTx ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-9 h-9 rounded-xl bg-bg-main shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3.5 w-32 bg-bg-main rounded" />
                        <div className="h-3 w-20 bg-bg-main rounded" />
                      </div>
                      <div className="h-4 w-16 bg-bg-main rounded" />
                    </div>
                  ))}
                </div>
              ) : recentTx.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-text-secondary text-sm">{t('No transactions yet.')}</p>
                  <button
                    onClick={() => openModal('expense')}
                    className="mt-2 text-primary text-sm hover:text-primary-hover"
                  >
                    {t('Add your first transaction')}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTx.map((tx) => {
                    const isIncome = tx.type === 'income' || tx.amount > 0
                    return (
                      <div key={tx.id} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-bg-main flex items-center justify-center text-base shrink-0">
                          {CATEGORY_ICONS[tx.category] || '💰'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-text-main text-sm font-medium truncate">{tx.title}</p>
                          <p className="text-text-secondary text-xs">{tx.category}</p>
                        </div>
                        <span
                          className={`text-sm font-semibold shrink-0 ${
                            isIncome ? 'text-positive' : 'text-negative'
                          }`}
                        >
                          {isIncome ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Spending Analysis */}
            <div className="bg-bg-card border border-border-subtle rounded-2xl p-5">
              <h3 className="text-text-main font-semibold text-sm mb-4">{t('Spending Analysis')}</h3>
              <DonutChart data={DONUT_DATA} />
            </div>
          </div>

          {/* Add transaction FAB for mobile */}
          <button
            onClick={() => openModal('expense')}
            className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary-hover text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center transition-colors z-10"
          >
            <Plus size={24} />
          </button>
        </main>
      </div>

      <AddTransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultTab={modalTab}
      />
    </div>
  )
}
