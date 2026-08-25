const routes = [
  // Rutas Públicas (Landing Page)
  {
    path: '/',
    component: () => import('../layouts/LandingLayout.vue'),
    children: [
      { path: '', component: () => import('../pages/LandingPage.vue') },
      { path: 'ai-assistant', component: () => import('../pages/AIAssistantPage.vue') }
    ]
  },
  
  // Rutas Privadas / Administrativas
  {
    path: '/login',
    component: () => import('../pages/LoginPage.vue')
  },
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    redirect: '/admin/dashboard',
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', component: () => import('../pages/Dashboard.vue') },
      { path: 'patients', component: () => import('../pages/PatientsDirectory.vue') },
      { path: 'patient/:id', component: () => import('../pages/PatientProfile.vue') },
      { path: 'medications', component: () => import('../pages/MedicationsDirectory.vue') },
      { path: 'users', component: () => import('../pages/UsersDirectory.vue') },
      { path: 'cobranza', component: () => import('../pages/cobranza/CobranzaPage.vue') },
      { path: 'settings', component: () => import('../pages/SettingsPage.vue') }
    ]
  },

  // Catch-all
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/ErrorNotFound.vue')
  }
]

export default routes
