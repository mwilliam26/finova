import { createContext, useContext, useState } from 'react'

const T = {
  English: {
    Dashboard: 'Dashboard', Transactions: 'Transactions', Reports: 'Reports',
    Payments: 'Payments', Goals: 'Goals', Profile: 'Profile',
    'Pro Plan': 'Pro Plan', 'Upgrade to Pro': 'Upgrade to Pro',
    'Unlock advanced analytics and unlimited transactions.': 'Unlock advanced analytics and unlimited transactions.',
    'Search transactions...': 'Search transactions...', 'Add Money': 'Add Money', 'Add Expense': 'Add Expense',
    'Sign out': 'Sign out',
    'Total Balance': 'Total Balance', 'Monthly Income': 'Monthly Income', 'Monthly Expenses': 'Monthly Expenses',
    'vs last month': 'vs last month', 'Monthly Comparison': 'Monthly Comparison',
    Income: 'Income', Expense: 'Expense', 'Exchange Rates': 'Exchange Rates', 'vs BRL': 'vs BRL',
    Unavailable: 'Unavailable', 'Recent Transactions': 'Recent Transactions', 'View all': 'View all',
    'No transactions yet.': 'No transactions yet.', 'Add your first transaction': 'Add your first transaction',
    'Spending Analysis': 'Spending Analysis',
    'Transaction History': 'Transaction History', transaction: 'transaction', transactions: 'transactions',
    'Search by description...': 'Search by description...', 'All Categories': 'All Categories', 'All Types': 'All Types',
    'Add New': 'Add New', 'Failed to load transactions. Please try again.': 'Failed to load transactions. Please try again.',
    Retry: 'Retry', 'No transactions found': 'No transactions found', 'Try adjusting your filters.': 'Try adjusting your filters.',
    Date: 'Date', Description: 'Description', Category: 'Category', Method: 'Method', Amount: 'Amount', Status: 'Status',
    'Profile Settings': 'Profile Settings', 'Personal Information': 'Personal Information',
    'Full Name': 'Full Name', 'Email Address': 'Email Address', 'Phone Number': 'Phone Number',
    Security: 'Security', Password: 'Password', 'Two-Factor Authentication': 'Two-Factor Authentication',
    'Add an extra layer of security': 'Add an extra layer of security',
    'Financial Preferences': 'Financial Preferences', Currency: 'Currency', Language: 'Language',
    'App Settings': 'App Settings', 'Dark Mode': 'Dark Mode', 'Use dark theme': 'Use dark theme',
    Notifications: 'Notifications', 'Receive transaction alerts': 'Receive transaction alerts',
    'Save Changes': 'Save Changes', 'Saved!': 'Saved!', 'Logout Session': 'Logout Session', 'Free Plan': 'Free Plan',
  },
  Português: {
    Dashboard: 'Painel', Transactions: 'Transações', Reports: 'Relatórios',
    Payments: 'Pagamentos', Goals: 'Metas', Profile: 'Perfil',
    'Pro Plan': 'Plano Pro', 'Upgrade to Pro': 'Assinar Pro',
    'Unlock advanced analytics and unlimited transactions.': 'Desbloqueie análises avançadas e transações ilimitadas.',
    'Search transactions...': 'Buscar transações...', 'Add Money': 'Adicionar', 'Add Expense': 'Despesa',
    'Sign out': 'Sair',
    'Total Balance': 'Saldo Total', 'Monthly Income': 'Receita Mensal', 'Monthly Expenses': 'Despesas Mensais',
    'vs last month': 'vs mês anterior', 'Monthly Comparison': 'Comparativo Mensal',
    Income: 'Receita', Expense: 'Despesa', 'Exchange Rates': 'Câmbio', 'vs BRL': 'vs BRL',
    Unavailable: 'Indisponível', 'Recent Transactions': 'Transações Recentes', 'View all': 'Ver todas',
    'No transactions yet.': 'Nenhuma transação ainda.', 'Add your first transaction': 'Adicionar primeira transação',
    'Spending Analysis': 'Análise de Gastos',
    'Transaction History': 'Histórico de Transações', transaction: 'transação', transactions: 'transações',
    'Search by description...': 'Buscar por descrição...', 'All Categories': 'Todas as Categorias', 'All Types': 'Todos os Tipos',
    'Add New': 'Novo', 'Failed to load transactions. Please try again.': 'Erro ao carregar. Tente novamente.',
    Retry: 'Tentar novamente', 'No transactions found': 'Nenhuma transação encontrada', 'Try adjusting your filters.': 'Tente ajustar os filtros.',
    Date: 'Data', Description: 'Descrição', Category: 'Categoria', Method: 'Método', Amount: 'Valor', Status: 'Status',
    'Profile Settings': 'Configurações do Perfil', 'Personal Information': 'Informações Pessoais',
    'Full Name': 'Nome Completo', 'Email Address': 'E-mail', 'Phone Number': 'Telefone',
    Security: 'Segurança', Password: 'Senha', 'Two-Factor Authentication': 'Autenticação em Dois Fatores',
    'Add an extra layer of security': 'Adicione uma camada extra de segurança',
    'Financial Preferences': 'Preferências Financeiras', Currency: 'Moeda', Language: 'Idioma',
    'App Settings': 'Configurações do App', 'Dark Mode': 'Modo Escuro', 'Use dark theme': 'Usar tema escuro',
    Notifications: 'Notificações', 'Receive transaction alerts': 'Receber alertas de transações',
    'Save Changes': 'Salvar Alterações', 'Saved!': 'Salvo!', 'Logout Session': 'Encerrar Sessão', 'Free Plan': 'Plano Gratuito',
  },
  Español: {
    Dashboard: 'Panel', Transactions: 'Transacciones', Reports: 'Informes',
    Payments: 'Pagos', Goals: 'Metas', Profile: 'Perfil',
    'Pro Plan': 'Plan Pro', 'Upgrade to Pro': 'Actualizar a Pro',
    'Unlock advanced analytics and unlimited transactions.': 'Desbloquea análisis avanzados y transacciones ilimitadas.',
    'Search transactions...': 'Buscar transacciones...', 'Add Money': 'Agregar', 'Add Expense': 'Gasto',
    'Sign out': 'Cerrar sesión',
    'Total Balance': 'Saldo Total', 'Monthly Income': 'Ingresos Mensuales', 'Monthly Expenses': 'Gastos Mensuales',
    'vs last month': 'vs mes anterior', 'Monthly Comparison': 'Comparación Mensual',
    Income: 'Ingresos', Expense: 'Gastos', 'Exchange Rates': 'Tipos de Cambio', 'vs BRL': 'vs BRL',
    Unavailable: 'No disponible', 'Recent Transactions': 'Transacciones Recientes', 'View all': 'Ver todo',
    'No transactions yet.': 'Sin transacciones.', 'Add your first transaction': 'Agregar primera transacción',
    'Spending Analysis': 'Análisis de Gastos',
    'Transaction History': 'Historial de Transacciones', transaction: 'transacción', transactions: 'transacciones',
    'Search by description...': 'Buscar por descripción...', 'All Categories': 'Todas las Categorías', 'All Types': 'Todos los Tipos',
    'Add New': 'Nuevo', 'Failed to load transactions. Please try again.': 'Error al cargar. Intente de nuevo.',
    Retry: 'Reintentar', 'No transactions found': 'No se encontraron transacciones', 'Try adjusting your filters.': 'Intente ajustar los filtros.',
    Date: 'Fecha', Description: 'Descripción', Category: 'Categoría', Method: 'Método', Amount: 'Monto', Status: 'Estado',
    'Profile Settings': 'Configuración de Perfil', 'Personal Information': 'Información Personal',
    'Full Name': 'Nombre Completo', 'Email Address': 'Correo Electrónico', 'Phone Number': 'Teléfono',
    Security: 'Seguridad', Password: 'Contraseña', 'Two-Factor Authentication': 'Autenticación de Dos Factores',
    'Add an extra layer of security': 'Agrega una capa extra de seguridad',
    'Financial Preferences': 'Preferencias Financieras', Currency: 'Moneda', Language: 'Idioma',
    'App Settings': 'Configuración de la App', 'Dark Mode': 'Modo Oscuro', 'Use dark theme': 'Usar tema oscuro',
    Notifications: 'Notificaciones', 'Receive transaction alerts': 'Recibir alertas de transacciones',
    'Save Changes': 'Guardar Cambios', 'Saved!': '¡Guardado!', 'Logout Session': 'Cerrar Sesión', 'Free Plan': 'Plan Gratuito',
  },
  Français: {
    Dashboard: 'Tableau de bord', Transactions: 'Transactions', Reports: 'Rapports',
    Payments: 'Paiements', Goals: 'Objectifs', Profile: 'Profil',
    'Pro Plan': 'Plan Pro', 'Upgrade to Pro': 'Passer à Pro',
    'Unlock advanced analytics and unlimited transactions.': 'Débloquez des analyses avancées et transactions illimitées.',
    'Search transactions...': 'Rechercher des transactions...', 'Add Money': 'Ajouter', 'Add Expense': 'Dépense',
    'Sign out': 'Se déconnecter',
    'Total Balance': 'Solde Total', 'Monthly Income': 'Revenus Mensuels', 'Monthly Expenses': 'Dépenses Mensuelles',
    'vs last month': 'vs mois précédent', 'Monthly Comparison': 'Comparaison Mensuelle',
    Income: 'Revenus', Expense: 'Dépenses', 'Exchange Rates': 'Taux de Change', 'vs BRL': 'vs BRL',
    Unavailable: 'Indisponible', 'Recent Transactions': 'Transactions Récentes', 'View all': 'Voir tout',
    'No transactions yet.': 'Aucune transaction.', 'Add your first transaction': 'Ajouter une transaction',
    'Spending Analysis': 'Analyse des Dépenses',
    'Transaction History': 'Historique des Transactions', transaction: 'transaction', transactions: 'transactions',
    'Search by description...': 'Rechercher par description...', 'All Categories': 'Toutes les Catégories', 'All Types': 'Tous les Types',
    'Add New': 'Nouveau', 'Failed to load transactions. Please try again.': 'Échec du chargement. Veuillez réessayer.',
    Retry: 'Réessayer', 'No transactions found': 'Aucune transaction trouvée', 'Try adjusting your filters.': "Essayez d'ajuster les filtres.",
    Date: 'Date', Description: 'Description', Category: 'Catégorie', Method: 'Méthode', Amount: 'Montant', Status: 'Statut',
    'Profile Settings': 'Paramètres du Profil', 'Personal Information': 'Informations Personnelles',
    'Full Name': 'Nom Complet', 'Email Address': 'Adresse Email', 'Phone Number': 'Numéro de Téléphone',
    Security: 'Sécurité', Password: 'Mot de passe', 'Two-Factor Authentication': 'Authentification à Deux Facteurs',
    'Add an extra layer of security': 'Ajoutez une couche de sécurité supplémentaire',
    'Financial Preferences': 'Préférences Financières', Currency: 'Devise', Language: 'Langue',
    'App Settings': "Paramètres de l'App", 'Dark Mode': 'Mode Sombre', 'Use dark theme': 'Utiliser le thème sombre',
    Notifications: 'Notifications', 'Receive transaction alerts': 'Recevoir des alertes de transactions',
    'Save Changes': 'Sauvegarder', 'Saved!': 'Sauvegardé!', 'Logout Session': 'Se Déconnecter', 'Free Plan': 'Plan Gratuit',
  },
}

const LangContext = createContext()

export function LangProvider({ children }) {
  const prefs = JSON.parse(localStorage.getItem('finova_prefs') || '{}')
  const [lang, setLang] = useState(prefs.language || 'English')

  const t = (key) => T[lang]?.[key] ?? T.English[key] ?? key

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
