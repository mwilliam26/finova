import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, DollarSign, Loader2 } from 'lucide-react'
import { createTransaction } from '../services/api'

const CATEGORIES = ['Housing', 'Food', 'Transport', 'Healthcare', 'Entertainment', 'Salary', 'Freelance', 'Investment', 'Misc']
const METHODS = ['Credit Card', 'Debit Card', 'Cash', 'PIX', 'Transfer']

const today = () => new Date().toISOString().split('T')[0]

export default function AddTransactionModal({ isOpen, onClose, defaultTab = 'expense' }) {
  const navigate = useNavigate()
  const [tab, setTab] = useState(defaultTab)
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: today(),
    method: 'Credit Card',
    notes: '',
  })
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.amount) {
      setError('Please fill in all required fields.')
      return
    }
    if (!agreed) {
      setError('Please accept the agreement to continue.')
      return
    }
    const rawAmount = parseFloat(form.amount)
    const amount = tab === 'expense' ? -Math.abs(rawAmount) : Math.abs(rawAmount)
    setLoading(true)
    try {
      const payload = {
        title: form.title.trim(),
        amount,
        category: form.category,
        date: new Date(form.date).toISOString(),
        method: form.method,
        status: 'Complete',
        type: tab,
        notes: form.notes,
      }
      const { data } = await createTransaction(payload)
      onClose()
      navigate('/success', { state: { transaction: data } })
    } catch (err) {
      console.error('Failed to create transaction:', err)
      setError('Failed to save transaction. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-bg-card border border-border-subtle rounded-2xl w-full max-w-md shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border-subtle">
          <h2 className="text-text-main font-semibold text-lg">Add Transaction</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-main transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-5 pb-0">
          {['income', 'expense'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all ${
                tab === t
                  ? t === 'income'
                    ? 'bg-positive/10 text-positive border border-positive/20'
                    : 'bg-negative/10 text-negative border border-negative/20'
                  : 'text-text-secondary hover:text-text-main border border-transparent'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-text-secondary text-xs font-medium mb-1.5">
              Transaction Title <span className="text-negative">*</span>
            </label>
            <input
              value={form.title}
              onChange={set('title')}
              placeholder="e.g. Monthly Salary"
              className="w-full bg-bg-main border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-main placeholder-text-secondary/50 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-text-secondary text-xs font-medium mb-1.5">
              Amount <span className="text-negative">*</span>
            </label>
            <div className="relative">
              <DollarSign size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={set('amount')}
                placeholder="0.00"
                className="w-full bg-bg-main border border-border-subtle rounded-lg pl-8 pr-3 py-2.5 text-sm text-text-main placeholder-text-secondary/50 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          {/* Category + Date row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-text-secondary text-xs font-medium mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={set('category')}
                className="w-full bg-bg-main border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary/50 transition-colors"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-text-secondary text-xs font-medium mb-1.5">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={set('date')}
                className="w-full bg-bg-main border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-text-secondary text-xs font-medium mb-1.5">Payment Method</label>
            <select
              value={form.method}
              onChange={set('method')}
              className="w-full bg-bg-main border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary/50 transition-colors"
            >
              {METHODS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-text-secondary text-xs font-medium mb-1.5">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={set('notes')}
              placeholder="Additional details..."
              rows={2}
              className="w-full bg-bg-main border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-main placeholder-text-secondary/50 focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </div>

          {/* Agreement */}
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 accent-primary"
            />
            <span className="text-text-secondary text-xs leading-relaxed">
              I agree that this transaction will be categorized and recorded in my financial history.
            </span>
          </label>

          {/* Error */}
          {error && (
            <p className="text-negative text-xs bg-negative/10 border border-negative/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-border-subtle text-text-secondary hover:text-text-main py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={15} className="animate-spin" />}
              {loading ? 'Saving...' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
