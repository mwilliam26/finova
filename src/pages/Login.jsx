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

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border-subtle" />
            <span className="text-text-secondary text-xs">or continue with</span>
            <div className="flex-1 h-px bg-border-subtle" />
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 border border-border-subtle rounded-lg py-2.5 text-sm text-text-secondary hover:border-primary/30 hover:text-text-main transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 border border-border-subtle rounded-lg py-2.5 text-sm text-text-secondary hover:border-primary/30 hover:text-text-main transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#0A66C2">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2" fill="#0A66C2"/>
              </svg>
              LinkedIn
            </button>
          </div>

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
