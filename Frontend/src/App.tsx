import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import Onboarding from './pages/Onboarding.tsx';
import AppPage, { AppHome, AppSettings } from './pages/AppPage.tsx';
import ImageGeneration from './pages/ImageGeneration.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import Navbar from './components/Navbar.tsx';

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
					<Route path="generate-images" element={<ImageGeneration />} />
				</Route>

				{/* Fallback */}
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	</ErrorBoundary>
	)
}