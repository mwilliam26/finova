# Finova — Smart Finance Dashboard

A modern personal finance management app built with React + Vite, featuring real-time exchange rates, transaction tracking, and a sleek dark UI.

## Tech Stack

- **React 18** + **Vite 6**
- **Tailwind CSS v3** — custom dark design system
- **React Router DOM v6** — client-side routing with protected routes
- **Axios** — HTTP client for MockAPI & Exchange Rate API
- **Lucide React** — icon library
- **date-fns** — date formatting

## Features

- **Authentication** — login with any credentials, JWT-like token in localStorage
- **Dashboard** — balance stats, monthly bar chart, donut spending analysis, live exchange rates (USD/EUR/GBP → BRL)
- **Transactions** — full list with filters, search, pagination, and status badges
- **Add Transaction Modal** — Income/Expense tabs, all fields, POST to MockAPI
- **Transaction Success** — animated confirmation with summary card
- **Profile** — editable personal info, toggles for 2FA, dark mode, notifications
- **Responsive** — fixed sidebar on desktop, hamburger drawer on mobile

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (opens browser automatically)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## APIs Used

| API | URL | Auth |
|-----|-----|------|
| MockAPI (transactions) | `https://67f0bc282a80b06b88f036d5.mockapi.io/api/v1` | None |
| Exchange Rates | `https://open.er-api.com/v6/latest/BRL` | None |

## Deploy on Vercel

1. Push the project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repository
4. Vercel auto-detects Vite — click **Deploy**
5. Done!

### Manual deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

## Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx              # Navigation sidebar (responsive)
│   ├── Navbar.jsx               # Top bar with search & quick actions
│   ├── StatCard.jsx             # KPI card with loading skeleton
│   ├── TransactionRow.jsx       # Table row for transactions
│   └── AddTransactionModal.jsx  # Modal form for new transactions
├── pages/
│   ├── Login.jsx                # Auth page
│   ├── Dashboard.jsx            # Main overview with charts
│   ├── Transactions.jsx         # Transaction history with filters
│   ├── Profile.jsx              # User settings
│   └── TransactionSuccess.jsx   # Post-transaction confirmation
├── services/
│   └── api.js                   # Axios instance + seed data
├── App.jsx                      # Router + protected routes
├── main.jsx                     # Entry point
└── index.css                    # Tailwind directives + CSS vars
```
