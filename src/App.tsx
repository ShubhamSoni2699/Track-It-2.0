import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GlobalStyles from './styles/GlobalStyles';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense } from 'react';
import SpinnerFullPage from './ui/SpinnerFullPage';
import ProtectedRoute from './ui/ProtectedRoute';
import { DarkModeProvider } from './context/DarkModeContext';
import { PrivacyModeProvider } from './context/PrivacyModeContext';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const DashboardCash = lazy(() => import('./pages/DashboardCash'));
const DashboardStocks = lazy(() => import('./pages/DashboardStocks'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));
const Stocks = lazy(() => import('./pages/Stocks'));
const MutualFunds = lazy(() => import('./pages/MutualFunds'));
const ProfitAndLoss = lazy(() => import('./pages/ProfitAndLoss'));
const TradingJournal = lazy(() => import('./pages/TradingJournal'));
const TradeBook = lazy(() => import('./pages/TradeBook'));
const Cash = lazy(() => import('./pages/Cash'));
const Assets = lazy(() => import('./pages/Assets'));
const Signup = lazy(() => import('./pages/Signup'));
const Login = lazy(() => import('./pages/Login'));
const Settings = lazy(() => import('./pages/Settings'));
const AppLayout = lazy(() => import('./ui/AppLayout'));
const Account = lazy(() => import('./pages/Account'));

const queryClient = new QueryClient();

function App() {
  return (
    <DarkModeProvider>
      <PrivacyModeProvider>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <GlobalStyles />
          <BrowserRouter>
            <Suspense fallback={<SpinnerFullPage />}>
              <Routes>
                <Route
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate replace to="dashboard" />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route
                    path="dashboard/dashboard-cash"
                    element={<DashboardCash />}
                  />
                  <Route
                    path="dashboard/dashboard-stocks"
                    element={<DashboardStocks />}
                  />
                  <Route path="/stocks" element={<Stocks />} />
                  <Route path="/stocks/mf" element={<MutualFunds />} />
                  <Route path="/stocks/tradebook" element={<TradeBook />} />
                  <Route
                    path="/stocks/trading-journal"
                    element={<TradingJournal />}
                  />
                  <Route
                    path="/stocks/profit&loss"
                    element={<ProfitAndLoss />}
                  />
                  <Route path="cash" element={<Cash />} />
                  <Route path="assets" element={<Assets />} />
                  <Route path="settings" element={<Settings />}>
                    <Route path="/settings/account" element={<Account />} />
                  </Route>
                </Route>
                <Route path="signup" element={<Signup />} />
                <Route path="login" element={<Login />} />
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>

          <Toaster
            position="top-center"
            gutter={12}
            containerStyle={{
              margin: '8px',
            }}
            toastOptions={{
              success: {
                duration: 3000,
              },
              error: {
                duration: 5000,
              },
              style: {
                fontSize: '16px',
                maxWidth: '500px',
                padding: '16px 24px',
                backgroundColor: 'var(--color-grey-0)',
                color: 'var(--color-grey-700)',
              },
            }}
          />
        </QueryClientProvider>
      </PrivacyModeProvider>
    </DarkModeProvider>
  );
}

export default App;
