import axios from 'axios'

const BASE_URL = 'https://6a21cf5ab1d0aaf32b4ffbcd.mockapi.io/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const getTransactions = () => api.get('/transactions')
export const createTransaction = (data) => api.post('/transactions', data)

const SEED_TRANSACTIONS = [
  { title: 'Salary', amount: 8200.00, category: 'Salary', date: '2026-06-01', method: 'Transfer', status: 'Complete', type: 'income' },
  { title: 'iFood', amount: -89.90, category: 'Food', date: '2026-06-03', method: 'Credit Card', status: 'Complete', type: 'expense' },
  { title: 'Uber', amount: -45.50, category: 'Transport', date: '2026-06-05', method: 'Debit Card', status: 'Complete', type: 'expense' },
  { title: 'Freelance Project', amount: 2500.00, category: 'Freelance', date: '2026-05-15', method: 'PIX', status: 'Complete', type: 'income' },
  { title: 'Salary', amount: 8200.00, category: 'Salary', date: '2026-05-01', method: 'Transfer', status: 'Complete', type: 'income' },
  { title: 'Netflix', amount: -55.90, category: 'Entertainment', date: '2026-05-20', method: 'Credit Card', status: 'Pending', type: 'expense' },
  { title: 'Grocery', amount: -310.00, category: 'Food', date: '2026-05-12', method: 'Debit Card', status: 'Complete', type: 'expense' },
  { title: 'Rent', amount: -2000.00, category: 'Housing', date: '2026-04-05', method: 'Transfer', status: 'Complete', type: 'expense' },
  { title: 'Salary', amount: 8200.00, category: 'Salary', date: '2026-04-01', method: 'Transfer', status: 'Complete', type: 'income' },
  { title: 'Investment Return', amount: 1500.00, category: 'Investment', date: '2026-04-10', method: 'Transfer', status: 'Complete', type: 'income' },
  { title: 'Transport Pass', amount: -180.00, category: 'Transport', date: '2026-03-20', method: 'Debit Card', status: 'Complete', type: 'expense' },
  { title: 'Salary', amount: 8200.00, category: 'Salary', date: '2026-03-01', method: 'Transfer', status: 'Complete', type: 'income' },
  { title: 'Electricity Bill', amount: -210.00, category: 'Housing', date: '2026-03-15', method: 'Transfer', status: 'Complete', type: 'expense' },
  { title: 'Bonus', amount: 3000.00, category: 'Salary', date: '2026-02-28', method: 'Transfer', status: 'Complete', type: 'income' },
  { title: 'Gym', amount: -120.00, category: 'Healthcare', date: '2026-02-10', method: 'Credit Card', status: 'Complete', type: 'expense' },
  { title: 'Salary', amount: 8200.00, category: 'Salary', date: '2026-02-01', method: 'Transfer', status: 'Complete', type: 'income' },
  { title: 'New Laptop', amount: -4500.00, category: 'Misc', date: '2026-01-22', method: 'Credit Card', status: 'Complete', type: 'expense' },
  { title: 'Salary', amount: 8200.00, category: 'Salary', date: '2026-01-01', method: 'Transfer', status: 'Complete', type: 'income' },
  { title: 'Spotify', amount: -21.90, category: 'Entertainment', date: '2026-01-15', method: 'Credit Card', status: 'Complete', type: 'expense' },
]

export const seedTransactions = async () => {
  const { data } = await getTransactions()
  if (data && data.length > 0) return
  await Promise.all(SEED_TRANSACTIONS.map((t) => createTransaction(t)))
}

export default api
