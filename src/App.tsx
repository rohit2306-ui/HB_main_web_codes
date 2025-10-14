import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Layout/Navbar";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import HomeFeed from "./pages/HomeFeed";
import CreatePost from "./pages/CreatePost";
import Dashboard from "./pages/Dashboard";
import SearchUsers from "./pages/SearchUsers";
import UserProfile from "./pages/UserProfile";
import Notifications from "./pages/Notifications";
import ConnectUps from "./pages/ConnectUps";
import MessageUser from "./pages/MessageUser";
import AllMessages from "./pages/AllMessages";
import CommunityChatPage from "./pages/CommunityChatPage";
import HackathonDetailsPage from "./pages/HackathonDetailsPage";
import RegisterHackathon from "./pages/RegisterHackathon";
import HackathonManagement from "./pages/HackathonManagement";
import EventRegistrationPage from "./pages/EventRegistrationPage";
import DSAQuestionPage from "./pages/DSAQuestionPage";
import DSAPracticePage from "./pages/DSAPracticePage";
import OpenProjects from "./pages/OpenProjects";
import OpenProjectDetails from "./pages/OpenProjectDetails";
import Prizes from "./pages/Prizes";
import DashboardPage from "../src/pages/Dashboardsec/DashboardPage.jsx";
import AboutSection from "../src/pages/Sections/AboutUs.jsx";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/" replace />;
};

// Public Route Component (redirect to feed if logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return !user ? <>{children}</> : <Navigate to="/feed" replace />;
};

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();

  // Routes where Navbar should not be shown
  const hideNavbarRoutes = [
    /^\/dsa\/\d+\/\d+$/, // matches /dsa/:level/:id
  ];

  const shouldHideNavbar = hideNavbarRoutes.some((pattern) =>
    pattern.test(location.pathname)
  );

  return (
    <>
      {user && !shouldHideNavbar && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <HomeFeed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:username"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/events" element={<Notifications />} />
        <Route path="/community/:communityId" element={<CommunityChatPage />} />
        <Route path="/hackathon/:id" element={<HackathonDetailsPage />} />
        <Route
          path="/hackathon/registration/:hackathonId/:userId"
          element={<RegisterHackathon />}
        />
        <Route path="/hackathon/:id/manage" element={<HackathonManagement />} />
        <Route
          path="/event/registration/:eventId"
          element={<EventRegistrationPage />}
        />
        <Route path="/openproject/:id" element={<OpenProjectDetails />} />
        <Route
          path="/openprojects"
          element={
            <ProtectedRoute>
              <OpenProjects />
            </ProtectedRoute>
          }
        />
        <Route path="/messageuser/:username" element={<MessageUser />} />
        <Route path="/communities" element={<AllMessages />} />
        <Route path="/prizes/:uid" element={<Prizes />} />

        {/* DSA Routes */}
        <Route
          path="/dsa"
          element={
            <ProtectedRoute>
              <DSAPracticePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dsa/:level/:id"
          element={
            <ProtectedRoute>
              <DSAQuestionPage />
            </ProtectedRoute>
          }
        />
        <Route path="aboutus" element={<AboutSection />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <AppContent />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
