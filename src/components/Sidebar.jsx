import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart2,
  CreditCard,
  Target,
  User,
  Zap,
  X,
} from 'lucide-react'
import { useLang } from '../contexts/LangContext'

const NAV_ITEMS = [
  { key: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { key: 'Transactions', icon: ArrowLeftRight, path: '/transactions' },
  { key: 'Reports', icon: BarChart2, path: '/reports' },
  { key: 'Payments', icon: CreditCard, path: '/payments' },
  { key: 'Goals', icon: Target, path: '/goals' },
  { key: 'Profile', icon: User, path: '/profile' },
]

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate()
  const { t } = useLang()

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-60 bg-bg-sidebar border-r border-border-subtle
          flex flex-col z-30 transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:flex
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-6 border-b border-border-subtle">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2.5 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-text-main font-bold text-lg tracking-tight">
              Finova
            </span>
          </button>
          <button
            onClick={onClose}
            className="lg:hidden text-text-secondary hover:text-text-main transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ key, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-bg-card hover:text-text-main'
                }`
              }
            >
              <Icon size={18} />
              {t(key)}
            </NavLink>
          ))}
        </nav>

        {/* Upgrade CTA */}
        <div className="p-4 border-t border-border-subtle">
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-primary" />
              <span className="text-primary text-xs font-semibold uppercase tracking-wider">
                {t('Pro Plan')}
              </span>
            </div>
            <p className="text-text-secondary text-xs mb-3 leading-relaxed">
              {t('Unlock advanced analytics and unlimited transactions.')}
            </p>
            <button className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-semibold py-2 rounded-lg transition-colors">
              {t('Upgrade to Pro')}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
