import { useState, useRef, useEffect } from 'react'
import { Search, Bell, Menu, Plus, TrendingDown, LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../contexts/LangContext'
import { getTransactions } from '../services/api'
import { formatDistanceToNow } from 'date-fns'

const NOTIF_SEEN_KEY = 'finova_notif_seen'

export default function Navbar({ onMenuOpen, onAddTransaction }) {
  const [query, setQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unread, setUnread] = useState(false)
  const dropdownRef = useRef(null)
  const notifRef = useRef(null)
  const navigate = useNavigate()
  const { t } = useLang()

  const user = JSON.parse(localStorage.getItem('finova_user') || '{}')
  const name = user.name || 'User'
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  useEffect(() => {
    getTransactions()
      .then(({ data }) => {
        const sorted = [...(data || [])]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
        setNotifications(sorted)

        const lastSeen = localStorage.getItem(NOTIF_SEEN_KEY)
        const newest = sorted[0]?.date
        if (newest && newest !== lastSeen) setUnread(true)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('finova_token')
    localStorage.removeItem('finova_user')
    navigate('/')
  }

  const handleNotifToggle = () => {
    const next = !notifOpen
    setNotifOpen(next)
    if (next && unread) {
      setUnread(false)
      if (notifications[0]?.date) {
        localStorage.setItem(NOTIF_SEEN_KEY, notifications[0].date)
      }
    }
  }

  return (
    <header className="h-16 bg-bg-card border-b border-border-subtle flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-10">
      {/* Hamburger */}
      <button
        onClick={onMenuOpen}
        className="lg:hidden text-text-secondary hover:text-text-main transition-colors"
      >
        <Menu size={22} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('Search transactions...')}
          className="w-full bg-bg-main border border-border-subtle rounded-lg pl-9 pr-4 py-2 text-sm text-text-main placeholder-text-secondary focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Quick action buttons */}
        <button
          onClick={() => onAddTransaction('income')}
          className="hidden sm:flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={15} />
          {t('Add Money')}
        </button>
        <button
          onClick={() => onAddTransaction('expense')}
          className="hidden sm:flex items-center gap-1.5 bg-bg-main border border-border-subtle hover:border-primary/40 text-text-secondary hover:text-text-main text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          <TrendingDown size={15} />
          {t('Add Expense')}
        </button>

        {/* Notification */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={handleNotifToggle}
            className="relative p-2 rounded-lg hover:bg-bg-main transition-colors text-text-secondary hover:text-text-main"
          >
            <Bell size={19} />
            {unread && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-pulse" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-11 w-72 bg-bg-card border border-border-subtle rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
              <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
                <p className="text-text-main text-sm font-semibold">{t('Notifications')}</p>
                {notifications.length > 0 && (
                  <span className="text-xs text-text-secondary">{notifications.length} recent</span>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Bell size={24} className="text-text-secondary mx-auto mb-2 opacity-40" />
                  <p className="text-text-secondary text-sm">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-border-subtle max-h-72 overflow-y-auto">
                  {notifications.map((tx) => {
                    const isIncome = tx.type === 'income' || tx.amount > 0
                    let timeAgo = ''
                    try {
                      timeAgo = formatDistanceToNow(new Date(tx.date), { addSuffix: true })
                    } catch {}

                    return (
                      <button
                        key={tx.id}
                        onClick={() => { setNotifOpen(false); navigate('/transactions') }}
                        className="w-full px-4 py-3 hover:bg-bg-main transition-colors text-left flex items-start gap-3"
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            isIncome ? 'bg-positive' : 'bg-negative'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-text-main text-xs font-medium truncate">{tx.title}</p>
                          <p className={`text-xs font-semibold ${isIncome ? 'text-positive' : 'text-negative'}`}>
                            {isIncome ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                          </p>
                          {timeAgo && (
                            <p className="text-text-secondary text-xs mt-0.5">{timeAgo}</p>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              <div className="px-4 py-2.5 border-t border-border-subtle">
                <button
                  onClick={() => { setNotifOpen(false); navigate('/transactions') }}
                  className="w-full text-center text-primary text-xs font-medium hover:text-primary-hover transition-colors"
                >
                  {t('View all')} transactions
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar + Dropdown */}
        <div className="relative pl-2 border-l border-border-subtle" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-primary text-xs font-bold">{initials}</span>
            </div>
            <span className="hidden md:block text-sm font-medium text-text-main">
              {name}
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-11 w-52 bg-bg-card border border-border-subtle rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border-subtle">
                <p className="text-text-main text-sm font-semibold truncate">{name}</p>
                <p className="text-text-secondary text-xs truncate">{user.email}</p>
              </div>
              <div className="p-1">
                <button
                  onClick={() => { setDropdownOpen(false); navigate('/profile') }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-secondary hover:bg-bg-main hover:text-text-main transition-colors"
                >
                  <User size={15} />
                  {t('Profile')}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={15} />
                  {t('Sign out')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
