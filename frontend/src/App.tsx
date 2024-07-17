import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RequestPasswordReset from './pages/RequestPasswordReset';
import PasswordReset from './pages/PasswordReset';
import ProductPage from './pages/ProductPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<RequestPasswordReset/>} />
          <Route path="/reset-password/:token" element={<PasswordReset/>} />
          <Route path="/product/:productName" element={<ProductPage/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
