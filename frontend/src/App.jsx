import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/DashboardPage';
import ComponentPage from './pages/ComponentPage';
import VehiclePage from './pages/VehiclePage';
import IssueManagementPage from './pages/IssueManagementPage';
import CheckoutPage from './pages/CheckoutPage';
import ReceiptPage from './pages/ReceiptPage';

// Placeholder pages for later phases
const Placeholder = ({ title }) => (
  <div style={{ padding: 20 }}>
    <h2>{title}</h2>
    <p>This page will be implemented in a future phase.</p>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="components" element={<ComponentPage />} />
        <Route path="vehicles" element={<VehiclePage />} />
        <Route path="vehicles/:id/issues" element={<IssueManagementPage />} />
        <Route path="transactions/:vehicleId/checkout" element={<CheckoutPage />} />
        <Route path="transactions/:transactionId/receipt" element={<ReceiptPage />} />
        <Route path="transactions" element={<Placeholder title="Transactions Page" />} />
        <Route path="*" element={<Placeholder title="404 Not Found" />} />
      </Route>
    </Routes>
  );
}

export default App;
