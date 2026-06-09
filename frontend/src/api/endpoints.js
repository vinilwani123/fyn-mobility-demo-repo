import apiInstance from './axios';

export const api = {
  dashboard: {
    getSummary: () => apiInstance.get('/dashboard/summary/'),
  },
  revenue: {
    getDaily: () => apiInstance.get('/revenue/daily/'),
    getMonthly: () => apiInstance.get('/revenue/monthly/'),
    getYearly: () => apiInstance.get('/revenue/yearly/'),
  },
  components: {
    getAll: () => apiInstance.get('/components/'),
    create: (data) => apiInstance.post('/components/', data),
    update: (id, data) => apiInstance.put(`/components/${id}/`, data),
    delete: (id) => apiInstance.delete(`/components/${id}/`),
  },
  vehicles: {
    getAll: () => apiInstance.get('/vehicles/'),
    create: (data) => apiInstance.post('/vehicles/', data),
    update: (id, data) => apiInstance.put(`/vehicles/${id}/`, data),
    delete: (id) => apiInstance.delete(`/vehicles/${id}/`),
  },
  issues: {
    getAll: () => apiInstance.get('/issues/'),
    create: (data) => apiInstance.post('/issues/', data),
    assignComponent: (issueId, data) => apiInstance.post(`/issues/${issueId}/assign_component/`, data),
  },
  transactions: {
    getAll: () => apiInstance.get('/transactions/'),
    simulatePayment: (data) => apiInstance.post('/transactions/simulate_payment/', data),
    pay: (transactionId) => apiInstance.post(`/transactions/${transactionId}/pay/`),
    getReceipt: (transactionId) => apiInstance.get(`/transactions/${transactionId}/receipt/`),
  }
};
