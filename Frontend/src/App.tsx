import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import AppPage, { AppHome, AppSettings } from './pages/AppPage';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';

export default function App() {
	return (
		<ErrorBoundary>
			<BrowserRouter>
				<Navbar />
				<Routes>
					{/* Public routes */}
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />

					{/* Protected routes */}
					<Route path="/onboarding" 
          element={
							<ProtectedRoute>
								<Onboarding />
							</ProtectedRoute>
						}
					/>

					<Route path="/app"
						element={
							<ProtectedRoute>
								<AppPage />
							</ProtectedRoute>
						}
					>
						<Route index element={<AppHome />} />
						<Route path="settings" element={<AppSettings />} />
					</Route>

					{/* Fallback */}
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</BrowserRouter>
		</ErrorBoundary>
	)
}
