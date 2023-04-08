import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/Index.vue') }]
  },
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [{ path: '', component: () => import('pages/system/auth/Login.vue') }]
  },
  {
    path: '/treasury',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/treasury/Treasury.vue') },
      { path: 'months', component: () => import('pages/treasury/Months.vue') },
      { path: 'entryexpense/:entryId/:expenseId', component: () => import('pages/treasury/EntryExpense.vue') },
      { path: 'entries', component: () => import('pages/treasury/entries/Entries.vue') },
      { path: 'week/:entryId/:expenseId', component: () => import('pages/treasury/entries/EntriesWeek.vue') },
      { path: 'entry/:entryId/:week', component: () => import('pages/treasury/entries/Entry.vue') },
      { path: 'report/:entryId/:expenseId', component: () => import('pages/treasury/flows/Report.vue') },
      { path: 'expenses', component: () => import('pages/treasury/expenses/Expenses.vue') },
      { path: 'expense/:expenseId', component: () => import('pages/treasury/expenses/Expense.vue') },
      { path: 'flows', component: () => import('pages/treasury/flows/Flows.vue') },
      { path: 'flows/initial', component: () => import('pages/treasury/flows/Initial.vue') },
      { path: 'flows/general', component: () => import('pages/treasury/flows/General.vue') },
      { path: 'accounts', component: () => import('pages/treasury/transactions/Accounts.vue') },
      { path: 'transactions/:entryId/:expenseId', component: () => import('pages/treasury/transactions/Transactions.vue') }
    ]
  },
  {
    path: '/secretary',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/secretary/Secretary.vue') },
      { path: 'members', component: () => import('pages/system/users/Member.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
