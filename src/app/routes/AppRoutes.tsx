import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { GeoFenceGuard } from "@/components/layout/GeoFenceGuard";
import { Suspense, lazy } from "react";
import { RouteLoader } from "@/shared/ui/RouteLoader";

// Lazy Pages
const HomePage = lazy(() => import("@/pages/HomePage").then(module => ({ default: module.HomePage })));
const HistoryPage = lazy(() => import("@/pages/HistoryPage").then(module => ({ default: module.HistoryPage })));
const ServicesPage = lazy(() => import("@/pages/ServicesPage").then(module => ({ default: module.ServicesPage })));
const OnboardingPage = lazy(() => import("@/pages/OnboardingPage").then(module => ({ default: module.OnboardingPage })));
const ProfilePage = lazy(() => import("@/pages/ProfilePage").then(module => ({ default: module.ProfilePage })));
const TransferPage = lazy(() => import("@/pages/TransferPage").then(module => ({ default: module.TransferPage })));
const ReceivePage = lazy(() => import("@/pages/ReceivePage").then(module => ({ default: module.ReceivePage })));
const ReceiptPage = lazy(() => import("@/pages/ReceiptPage").then(module => ({ default: module.ReceiptPage })));
const ServiceDetailPage = lazy(() => import("@/pages/ServiceDetailPage").then(module => ({ default: module.ServiceDetailPage })));
const PaymentRequestPage = lazy(() => import("@/pages/PaymentRequestPage").then(module => ({ default: module.PaymentRequestPage })));
const RewardsPage = lazy(() => import("@/pages/RewardsPage").then(module => ({ default: module.RewardsPage })));
const NotificationsPage = lazy(() => import("@/pages/NotificationsPage").then(module => ({ default: module.NotificationsPage })));
const ContactsPage = lazy(() => import("@/pages/ContactsPage").then(module => ({ default: module.ContactsPage })));
const TransactionDetailPage = lazy(() => import("@/pages/TransactionDetailPage").then(module => ({ default: module.TransactionDetailPage })));
const QRScannerPage = lazy(() => import("@/pages/QRScannerPage").then(module => ({ default: module.QRScannerPage })));
const AnalyticsPage = lazy(() => import("@/pages/AnalyticsPage").then(module => ({ default: module.AnalyticsPage })));

export const AppRoutes = () => {
    const location = useLocation();

    return (
        <Suspense fallback={<RouteLoader />}>
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    {/* Public Routes */}
                    <Route path="/onboarding" element={<OnboardingPage />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={
                            <GeoFenceGuard>
                                <MainLayout />
                            </GeoFenceGuard>
                        }>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/history" element={<HistoryPage />} />
                            <Route path="/services" element={<ServicesPage />} />
                            <Route path="/services/:id" element={<ServiceDetailPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/rewards" element={<RewardsPage />} />
                            <Route path="/transfer" element={<TransferPage />} />
                            <Route path="/receive" element={<ReceivePage />} />
                            <Route path="/receipt" element={<ReceiptPage />} />
                            <Route path="/pay/:id" element={<PaymentRequestPage />} />
                            <Route path="/notifications" element={<NotificationsPage />} />
                            <Route path="/contacts" element={<ContactsPage />} />
                            <Route path="/transaction/:id" element={<TransactionDetailPage />} />
                            <Route path="/scan" element={<QRScannerPage />} />
                            <Route path="/analytics" element={<AnalyticsPage />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AnimatePresence>
        </Suspense>
    );
};
