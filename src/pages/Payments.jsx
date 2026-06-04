import { useState } from 'react'
import { CreditCard, Plus, Zap, Shield, Smartphone } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

const CARDS = [
  { id: 1, label: 'Visa ending in 4242', brand: 'Visa', last4: '4242', expiry: '12/27', default: true },
  { id: 2, label: 'Mastercard ending in 8888', brand: 'Mastercard', last4: '8888', expiry: '08/26', default: false },
]

const RECENT_PAYMENTS = [
  { id: 1, name: 'Netflix', amount: -15.99, date: '2026-06-01', status: 'paid' },
  { id: 2, name: 'Spotify', amount: -9.99, date: '2026-06-01', status: 'paid' },
  { id: 3, name: 'AWS', amount: -42.00, date: '2026-05-28', status: 'paid' },
  { id: 4, name: 'GitHub', amount: -4.00, date: '2026-05-25', status: 'paid' },
]

export default function Payments() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-bg-main overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 px-4 lg:px-8 py-6 space-y-6">
          <div>
            <h1 className="text-text-main text-2xl font-bold">Payments</h1>
            <p className="text-text-secondary text-sm mt-1">Manage your payment methods and billing</p>
          </div>

          {/* Payment Methods */}
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-text-main font-semibold">Payment Methods</h2>
              <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                <Plus size={14} />
                Add Card
              </button>
            </div>

            <div className="space-y-3">
              {CARDS.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border-subtle bg-bg-main"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CreditCard size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-text-main text-sm font-medium">{card.brand} •••• {card.last4}</p>
                      <p className="text-text-secondary text-xs">Expires {card.expiry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {card.default && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <Shield size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="text-text-main text-sm font-semibold">Secure Payments</p>
                <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                  All transactions are encrypted and protected by 256-bit SSL.
                </p>
              </div>
            </div>
            <div className="bg-bg-card border border-border-subtle rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                <Smartphone size={18} className="text-purple-400" />
              </div>
              <div>
                <p className="text-text-main text-sm font-semibold">Two-Factor Auth</p>
                <p className="text-text-secondary text-xs mt-1 leading-relaxed">
                  Enable 2FA for an extra layer of security on every payment.
                </p>
              </div>
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-bg-card border border-border-subtle rounded-2xl p-6">
            <h2 className="text-text-main font-semibold mb-4">Recent Payments</h2>
            <div className="space-y-3">
              {RECENT_PAYMENTS.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Zap size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-text-main text-sm font-medium">{p.name}</p>
                      <p className="text-text-secondary text-xs">{p.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-red-400 text-sm font-semibold">
                      ${Math.abs(p.amount).toFixed(2)}
                    </p>
                    <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
