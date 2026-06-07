import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [keepLogged, setKeepLogged] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.')
      return
    }
    const users = JSON.parse(localStorage.getItem('finova_users') || '[]')
    const user = users.find((u) => u.email === email && u.password === password)
    if (!user) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    localStorage.setItem('finova_token', 'token-' + Date.now())
    localStorage.setItem('finova_user', JSON.stringify({ name: user.name, email: user.email }))
    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-text-main font-bold text-2xl tracking-tight">Finova</span>
        </div>

        {/* Card */}
        <div className="bg-bg-card border border-border-subtle rounded-2xl p-8">
          <h1 className="text-text-main text-2xl font-bold mb-1.5">Welcome back</h1>
          <p className="text-text-secondary text-sm mb-7">Sign in to continue to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
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

            {/* Password */}
            <div>
              <label className="block text-text-secondary text-xs font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
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

            {/* Keep logged */}
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={keepLogged}
                onChange={(e) => setKeepLogged(e.target.checked)}
                className="accent-primary"
              />
              <span className="text-text-secondary text-sm">Keep me logged in</span>
            </label>

            {/* Error */}
            {error && (
              <p className="text-negative text-xs bg-negative/10 border border-negative/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Submit */}
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
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-text-secondary text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary-hover font-medium transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
