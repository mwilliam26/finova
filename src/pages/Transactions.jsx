import { useState, useEffect, useMemo } from 'react'
import { Plus, Search, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import TransactionRow from '../components/TransactionRow'
import AddTransactionModal from '../components/AddTransactionModal'
import { getTransactions, seedTransactions } from '../services/api'
import { useLang } from '../contexts/LangContext'

const CATEGORIES = ['All Categories', 'Housing', 'Food', 'Transport', 'Healthcare', 'Entertainment', 'Salary', 'Freelance', 'Investment', 'Misc']
const TYPES = ['All Types', 'income', 'expense']
const PAGE_SIZE = 10

export default function Transactions() {
  const { t } = useLang()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [type, setType] = useState('All Types')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)

  const load = () => {
    setLoading(true)
    setError('')
    seedTransactions()
      .then(() => getTransactions())
      .then(({ data }) => setTransactions(data || []))
      .catch((err) => {
        console.error('Failed to load transactions:', err)
        setError('Failed to load transactions. Please try again.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => {
        if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
        if (category !== 'All Categories' && t.category !== category) return false
        if (type !== 'All Types' && t.type !== type) return false
        if (dateFrom && new Date(t.date) < new Date(dateFrom)) return false
        if (dateTo && new Date(t.date) > new Date(dateTo)) return false
        return true
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [transactions, search, category, type, dateFrom, dateTo])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleFilterChange = (setter) => (e) => { setter(e.target.value); setPage(1) }

  return (
    <div className="flex h-screen overflow-hidden bg-bg-main">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuOpen={() => setSidebarOpen(true)} onAddTransaction={(tab) => setModalOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-text-main text-xl font-bold">{t('Transaction History')}</h1>
              <p className="text-text-secondary text-sm mt-0.5">
                {filtered.length} {filtered.length !== 1 ? t('transactions') : t('transaction')}
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={16} />
              {t('Add New')}
            </button>
          </div>

          {/* Filters */}
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-4 mb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search */}
              <div className="lg:col-span-2 relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  value={search}
                  onChange={handleFilterChange(setSearch)}
                  placeholder={t('Search by description...')}
                  className="w-full bg-bg-main border border-border-subtle rounded-lg pl-9 pr-3 py-2 text-sm text-text-main placeholder-text-secondary/50 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              {/* Date from */}
              <div className="relative">
                <input
                  type="date"
                  value={dateFrom}
                  onChange={handleFilterChange(setDateFrom)}
                  className="w-full bg-bg-main border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-secondary focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              {/* Category */}
              <select
                value={category}
                onChange={handleFilterChange(setCategory)}
                className="bg-bg-main border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-secondary focus:outline-none focus:border-primary/50 transition-colors"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c === 'All Categories' ? t('All Categories') : c}</option>
                ))}
              </select>
              {/* Type */}
              <select
                value={type}
                onChange={handleFilterChange(setType)}
                className="bg-bg-main border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-secondary focus:outline-none focus:border-primary/50 transition-colors capitalize"
              >
                {TYPES.map((type) => (
                  <option key={type} value={type} className="capitalize">
                    {type === 'All Types' ? t('All Types') : type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-bg-card border border-border-subtle rounded-2xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={28} className="animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <AlertCircle size={28} className="text-negative" />
                <p className="text-text-secondary text-sm">{t('Failed to load transactions. Please try again.')}</p>
                <button
                  onClick={load}
                  className="text-primary text-sm hover:text-primary-hover transition-colors"
                >
                  {t('Retry')}
                </button>
              </div>
            ) : paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-2">
                <p className="text-text-main font-medium">{t('No transactions found')}</p>
                <p className="text-text-secondary text-sm">{t('Try adjusting your filters.')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border-subtle">
                      {[t('Date'), t('Description'), t('Category'), t('Method'), t('Amount'), t('Status'), ''].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-text-secondary text-xs font-medium uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((tx) => (
                      <TransactionRow key={tx.id} transaction={tx} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border-subtle">
                <span className="text-text-secondary text-xs">
                  Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg text-text-secondary hover:text-text-main hover:bg-bg-main disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                        n === page
                          ? 'bg-primary text-white'
                          : 'text-text-secondary hover:bg-bg-main hover:text-text-main'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-lg text-text-secondary hover:text-text-main hover:bg-bg-main disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <AddTransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultTab="expense"
      />
    </div>
  )
}
