import axios from 'axios'

const BASE_URL = 'https://6a21cf5ab1d0aaf32b4ffbcd.mockapi.io/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const getTransactions = () => api.get('/transactions')
export const createTransaction = (data) => api.post('/transactions', data)

const SEED_TRANSACTIONS = [
  { title: 'Apple Store', amount: -1299.00, category: 'Electronics', date: '2024-10-24', method: 'Credit Card', status: 'Complete', type: 'expense' },
  { title: 'Salary', amount: 8200.00, category: 'Salary', date: '2024-10-01', method: 'Transfer', status: 'Complete', type: 'income' },
  { title: 'Uber', amount: -45.50, category: 'Transport', date: '2024-10-23', method: 'Debit Card', status: 'Complete', type: 'expense' },
  { title: 'Freelance Project', amount: 2500.00, category: 'Freelance', date: '2024-10-15', method: 'PIX', status: 'Complete', type: 'income' },
  { title: 'iFood', amount: -89.90, category: 'Food', date: '2024-10-22', method: 'Credit Card', status: 'Complete', type: 'expense' },
  { title: 'Netflix', amount: -55.90, category: 'Entertainment', date: '2024-10-20', method: 'Credit Card', status: 'Pending', type: 'expense' },
  { title: 'APS Service', amount: -840.00, category: 'Housing', date: '2024-10-18', method: 'Transfer', status: 'Complete', type: 'expense' },
  { title: 'Investment Return', amount: 1200.00, category: 'Investment', date: '2024-10-10', method: 'Transfer', status: 'Complete', type: 'income' },
]

export const seedTransactions = async () => {
  const { data } = await getTransactions()
  if (data && data.length > 0) return
  await Promise.all(SEED_TRANSACTIONS.map((t) => createTransaction(t)))
}

export default api
