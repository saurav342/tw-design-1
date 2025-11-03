import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/toaster.jsx';
import Home from './pages/Home';
import Investors from './pages/Investors';
import Founders from './pages/Founders';
import Portfolio from './pages/Portfolio';
import Resources from './pages/Resources';
import Login from './pages/Login';
import Signup from './pages/Signup';
import InvestorSignup from './pages/InvestorSignup';
import FounderSignup from './pages/FounderSignup';
import InvestorDashboard from './pages/InvestorDashboard';
import FounderDashboard from './pages/FounderDashboard';
import FounderMarketplace from './pages/FounderMarketplace';
import FounderSuccessFee from './pages/FounderSuccessFee';
import FounderServices from './pages/FounderServices';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

const App = () => (
  <AuthProvider>
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/investors" element={<Investors />} />
          <Route path="/founders" element={<Founders />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/investor" element={<InvestorSignup />} />
          <Route path="/signup/founder" element={<FounderSignup />} />
          <Route
            path="/dashboard/investor"
            element={
              <ProtectedRoute roles={['investor']}>
                <InvestorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/founder"
            element={
              <ProtectedRoute roles={['founder']}>
                <FounderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/founder/marketplace"
            element={
              <ProtectedRoute roles={['founder']}>
                <FounderMarketplace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/founder/success-fee"
            element={
              <ProtectedRoute roles={['founder']}>
                <FounderSuccessFee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/founder/services"
            element={
              <ProtectedRoute roles={['founder']}>
                <FounderServices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </div>
  </AuthProvider>
);

export default App;
