import { format } from 'date-fns'

const STATUS_STYLES = {
  Complete: 'bg-positive/10 text-positive',
  Pending: 'bg-yellow-500/10 text-yellow-400',
  Failed: 'bg-negative/10 text-negative',
}

const CATEGORY_ICONS = {
  Housing: '🏠',
  Food: '🍔',
  Transport: '🚗',
  Healthcare: '💊',
  Entertainment: '🎮',
  Salary: '💼',
  Freelance: '💻',
  Investment: '📈',
  Misc: '📦',
}

export default function TransactionRow({ transaction, onDelete }) {
  const { title, amount, category, method, date, status, type } = transaction
  const isIncome = type === 'income' || amount > 0
  const formattedAmount = `${isIncome ? '+' : ''}$${Math.abs(amount).toFixed(2)}`
  const amountColor = isIncome ? 'text-positive' : 'text-negative'

  let formattedDate = '—'
  try {
    formattedDate = format(new Date(date), 'MMM d, yyyy')
  } catch {}

  return (
    <tr className="border-b border-border-subtle hover:bg-bg-main/40 transition-colors group">
      <td className="px-4 py-3.5 text-text-secondary text-sm">{formattedDate}</td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <span className="text-lg">{CATEGORY_ICONS[category] || '💰'}</span>
          <span className="text-text-main text-sm font-medium">{title}</span>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <span className="text-text-secondary text-sm bg-bg-main px-2.5 py-1 rounded-md">
          {category}
        </span>
      </td>
      <td className="px-4 py-3.5 text-text-secondary text-sm">{method}</td>
      <td className="px-4 py-3.5">
        <span className={`text-sm font-semibold ${amountColor}`}>
          {formattedAmount}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <span
          className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
            STATUS_STYLES[status] || 'bg-bg-main text-text-secondary'
          }`}
        >
          {status}
        </span>
      </td>
      <td className="px-4 py-3.5">
        {onDelete && (
          <button
            onClick={() => onDelete(transaction.id)}
            className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-negative text-xs transition-all"
          >
            Delete
          </button>
        )}
      </td>
    </tr>
  )
}
