import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Lock, Shield, Globe, Moon, Bell, LogOut, Zap } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import { useLang } from '../contexts/LangContext'

function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        checked ? 'bg-primary' : 'bg-border-subtle'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-bg-card border border-border-subtle rounded-2xl p-5">
      <h3 className="text-text-main font-semibold text-sm mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, icon: Icon, value, onChange, type = 'text', readOnly }) {
  return (
    <div>
      <label className="block text-text-secondary text-xs font-medium mb-1.5">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          className={`w-full bg-bg-main border border-border-subtle rounded-lg ${Icon ? 'pl-9' : 'pl-3'} pr-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary/50 transition-colors ${
            readOnly ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        />
      </div>
    </div>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const { t, setLang } = useLang()
  const user = JSON.parse(localStorage.getItem('finova_user') || '{}')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [form, setForm] = useState({
    name: user.name || 'Alex Rivera',
    email: user.email || 'alex@example.com',
    phone: '+1 (555) 000-0000',
  })
  const prefs = JSON.parse(localStorage.getItem('finova_prefs') || '{}')
  const [twoFA, setTwoFA] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [currency, setCurrency] = useState(prefs.currency || 'USD')
  const [language, setLanguage] = useState(prefs.language || 'English')
  const [saved, setSaved] = useState(false)

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }))

  const handleSave = () => {
    localStorage.setItem('finova_user', JSON.stringify({ ...user, name: form.name, email: form.email }))
    localStorage.setItem('finova_prefs', JSON.stringify({ currency, language }))
    setLang(language)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleLogout = () => {
    localStorage.removeItem('finova_token')
    localStorage.removeItem('finova_user')
    navigate('/')
  }

  const initials = form.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex h-screen overflow-hidden bg-bg-main">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuOpen={() => setSidebarOpen(true)} onAddTransaction={() => {}} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 animate-fade-in">
          <h1 className="text-text-main text-xl font-bold mb-6">{t('Profile Settings')}</h1>

          <div className="max-w-2xl space-y-5">
            {/* Avatar header */}
            <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center shrink-0">
                <span className="text-primary text-xl font-bold">{initials}</span>
              </div>
              <div>
                <p className="text-text-main font-semibold">{form.name}</p>
                <p className="text-text-secondary text-sm">{form.email}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Zap size={12} className="text-primary" />
                  <span className="text-primary text-xs font-medium">{t('Free Plan')}</span>
                </div>
              </div>
            </div>

            {/* Personal info */}
            <Section title={t('Personal Information')}>
              <Field label={t('Full Name')} icon={User} value={form.name} onChange={set('name')} />
              <Field label={t('Email Address')} icon={Mail} value={form.email} onChange={set('email')} type="email" />
              <Field label={t('Phone Number')} icon={Phone} value={form.phone} onChange={set('phone')} type="tel" />
              <button
                onClick={handleSave}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  saved
                    ? 'bg-positive/10 text-positive border border-positive/20'
                    : 'bg-primary hover:bg-primary-hover text-white'
                }`}
              >
                {saved ? t('Saved!') : t('Save Changes')}
              </button>
            </Section>

            {/* Security */}
            <Section title={t('Security')}>
              <Field label={t('Password')} icon={Lock} value="••••••••••••" readOnly />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield size={16} className="text-text-secondary" />
                  <div>
                    <p className="text-text-main text-sm font-medium">{t('Two-Factor Authentication')}</p>
                    <p className="text-text-secondary text-xs">{t('Add an extra layer of security')}</p>
                  </div>
                </div>
                <Toggle checked={twoFA} onChange={setTwoFA} />
              </div>
            </Section>

            {/* Financial Preferences */}
            <Section title={t('Financial Preferences')}>
              <div>
                <label className="block text-text-secondary text-xs font-medium mb-1.5">{t('Currency')}</label>
                <div className="relative">
                  <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-bg-main border border-border-subtle rounded-lg pl-9 pr-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary/50 transition-colors"
                  >
                    {['USD', 'BRL', 'EUR', 'GBP'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-text-secondary text-xs font-medium mb-1.5">{t('Language')}</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-bg-main border border-border-subtle rounded-lg px-3 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary/50 transition-colors"
                >
                  {['English', 'Português', 'Español', 'Français'].map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
            </Section>

            {/* App Settings */}
            <Section title={t('App Settings')}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon size={16} className="text-text-secondary" />
                  <div>
                    <p className="text-text-main text-sm font-medium">{t('Dark Mode')}</p>
                    <p className="text-text-secondary text-xs">{t('Use dark theme')}</p>
                  </div>
                </div>
                <Toggle checked={darkMode} onChange={setDarkMode} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell size={16} className="text-text-secondary" />
                  <div>
                    <p className="text-text-main text-sm font-medium">{t('Notifications')}</p>
                    <p className="text-text-secondary text-xs">{t('Receive transaction alerts')}</p>
                  </div>
                </div>
                <Toggle checked={notifications} onChange={setNotifications} />
              </div>
            </Section>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-negative/10 hover:bg-negative/20 border border-negative/20 text-negative py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              <LogOut size={16} />
              {t('Logout Session')}
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
