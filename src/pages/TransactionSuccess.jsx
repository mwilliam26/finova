import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, ArrowLeft, List } from 'lucide-react'
import { format } from 'date-fns'

export default function TransactionSuccess() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const tx = state?.transaction

  const fmt = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(n))

  let formattedDate = '—'
  try {
    formattedDate = format(new Date(tx?.date), 'MMMM d, yyyy')
  } catch {}

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center animate-fade-in">
        {/* Animated check */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center animate-scale-in">
            <CheckCircle size={40} className="text-primary" />
          </div>
        </div>

        <h1 className="text-text-main text-2xl font-bold mb-2">Transaction added!</h1>
        <p className="text-text-secondary text-sm mb-8">
          Your transaction has been successfully recorded in your financial history.
        </p>

        {/* Summary card */}
        {tx && (
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 mb-6 text-left space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-sm">Amount</span>
              <span
                className={`text-base font-bold ${
                  tx.type === 'income' || tx.amount > 0 ? 'text-positive' : 'text-negative'
                }`}
              >
                {tx.type === 'income' || tx.amount > 0 ? '+' : ''}{fmt(tx.amount)}
              </span>
            </div>
            <div className="h-px bg-border-subtle" />
            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-sm">Category</span>
              <span className="text-text-main text-sm font-medium">{tx.category}</span>
            </div>
            <div className="h-px bg-border-subtle" />
            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-sm">Date</span>
              <span className="text-text-main text-sm font-medium">{formattedDate}</span>
            </div>
            <div className="h-px bg-border-subtle" />
            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-sm">Status</span>
              <span className="text-positive text-sm font-medium">{tx.status}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/transactions')}
            className="flex items-center justify-center gap-2 border border-border-subtle text-text-secondary hover:text-text-main hover:border-primary/30 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <List size={15} />
            View Transactions
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
