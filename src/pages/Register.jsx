import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Zap, User } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !email.trim() || !password.trim() || !confirm.trim()) {
      setError('Please fill in all fields.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    const users = JSON.parse(localStorage.getItem('finova_users') || '[]')
    if (users.find((u) => u.email === email)) {
      setError('An account with this email already exists.')
      return
    }

    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))

    users.push({ name: name.trim(), email, password })
    localStorage.setItem('finova_users', JSON.stringify(users))
    localStorage.setItem('finova_token', 'token-' + Date.now())
    localStorage.setItem('finova_user', JSON.stringify({ name: name.trim(), email }))

    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-text-main font-bold text-2xl tracking-tight">Finova</span>
        </div>

        <div className="bg-bg-card border border-border-subtle rounded-2xl p-8">
          <h1 className="text-text-main text-2xl font-bold mb-1.5">Create account</h1>
          <p className="text-text-secondary text-sm mb-7">Sign up to get started with Finova</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-text-secondary text-xs font-medium mb-1.5">Full name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  className="w-full bg-bg-main border border-border-subtle rounded-lg pl-9 pr-4 py-2.5 text-sm text-text-main placeholder-text-secondary/50 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-text-secondary text-xs font-medium mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full bg-bg-main border border-border-subtle rounded-lg pl-9 pr-4 py-2.5 text-sm text-text-main placeholder-text-secondary/50 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-text-secondary text-xs font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  className="w-full bg-bg-main border border-border-subtle rounded-lg pl-9 pr-10 py-2.5 text-sm text-text-main placeholder-text-secondary/50 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main transition-colors"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-text-secondary text-xs font-medium mb-1.5">Confirm password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className="w-full bg-bg-main border border-border-subtle rounded-lg pl-9 pr-4 py-2.5 text-sm text-text-main placeholder-text-secondary/50 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            {error && (
              <p className="text-negative text-xs bg-negative/10 border border-negative/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-text-secondary text-sm mt-6">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/')}
              className="text-primary hover:text-primary-hover font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
