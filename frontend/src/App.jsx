import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import NotificationProvider from './context/NotificationContext';
import Home from './pages/Home';
import Investors from './pages/Investors';
import Founders from './pages/Founders';
import Portfolio from './pages/Portfolio';
import Resources from './pages/Resources';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Signup from './pages/Signup';
import EmailEntry from './pages/EmailEntry';
import OTPVerification from './pages/OTPVerification';
import InvestorSignup from './pages/InvestorSignup';
import FounderSignup from './pages/FounderSignup';
import PaymentDetails from './pages/PaymentDetails';
import Checkout from './pages/Checkout';
import PaymentConfirmation from './pages/PaymentConfirmation';
import InvestorDashboard from './pages/InvestorDashboard';
import FounderDashboard from './pages/FounderDashboard';
import FounderMarketplace from './pages/FounderMarketplace';
import FounderSuccessFee from './pages/FounderSuccessFee';
import FounderServices from './pages/FounderServices';
import FounderServiceStory from './pages/FounderServiceStory';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
// Service landing pages
import PitchDeckPreparation from './pages/services/PitchDeckPreparation';
import MentorshipAdvisory from './pages/services/MentorshipAdvisory';
import FinancialProjections from './pages/services/FinancialProjections';
import LegalCompliance from './pages/services/LegalCompliance';
import TechEnhancementSupport from './pages/services/TechEnhancementSupport';
import GrowthMarketing from './pages/services/GrowthMarketing';

const AppContent = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Routes>
        {/* Admin login route without navbar */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* All other routes with navbar */}
        <Route
          path="*"
          element={
            <>
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
                  <Route path="/signup/email" element={<EmailEntry />} />
                  <Route path="/signup/:role/verify-otp" element={<OTPVerification />} />
                  <Route path="/signup/investor" element={<InvestorSignup />} />
                  <Route path="/signup/founder" element={<FounderSignup />} />
                  <Route path="/payment-details" element={<PaymentDetails />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
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
                  {/* Public service landing pages - must come BEFORE dynamic route */}
                  <Route path="/services/pitch-deck-preparation" element={<PitchDeckPreparation />} />
                  <Route path="/services/mentorship-advisory" element={<MentorshipAdvisory />} />
                  <Route path="/services/financial-projections" element={<FinancialProjections />} />
                  <Route path="/services/legal-compliance" element={<LegalCompliance />} />
                  <Route path="/services/tech-enhancement-support" element={<TechEnhancementSupport />} />
                  <Route path="/services/growth-marketing" element={<GrowthMarketing />} />
                  {/* Dynamic route for old service story pages - must come AFTER specific routes */}
                  <Route path="/services/:serviceId" element={<FounderServiceStory />} />
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
            </>
          }
        />
      </Routes>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  </AuthProvider>
);

export default App;
