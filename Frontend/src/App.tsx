import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import supabase from './lib/supabaseClient.ts';
import useStore from './store/useStore.ts';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import Onboarding from './pages/Onboarding.tsx';
import AppPage, { AppHome, AppSettings } from './pages/AppPage.tsx';
import ImageGeneration from './pages/ImageGeneration.tsx';
import ReelsGeneration from './pages/ReelsGeneration.tsx';
import TodaysContent from './pages/TodaysContent.tsx';
import BrandAssets from './pages/BrandAssets.tsx';
import ImageHistory from './pages/ImageHistory.tsx';
import ImageHistoryDetail from './pages/ImageHistoryDetail.tsx';
import ReelsHistory from './pages/ReelsHistory.tsx';
import NotFound from './pages/NotFound.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import Navbar from './components/Navbar.tsx';
import ScrollToTop from './components/ScrollToTop.tsx';
import AssetFeedback from './pages/AssetFeedback.tsx';

export default function App() {
  const setSession = useStore((s) => s.setSession)
  const setUser = useStore((s) => s.setUser)

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user?.id)
      if (session?.user?.id) {
        localStorage.setItem('userId', session.user.id)
      } else {
        localStorage.removeItem('userId')
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user?.id)
      if (session?.user?.id) {
        localStorage.setItem('userId', session.user.id)
      } else {
        localStorage.removeItem('userId')
      }
    })

    return () => subscription.unsubscribe()
  }, [setSession, setUser])

	return (
		<ErrorBoundary>
			<BrowserRouter>
				<ScrollToTop />
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
						<Route path="generate-reels" element={<ReelsGeneration />} />
						<Route path="todays-content" element={<TodaysContent />} />
						<Route path="assets" element={<BrandAssets />} />
						<Route path="assets/feedback" element={<AssetFeedback />} />
						<Route path="assets/history" element={<ImageHistory />} />
						<Route path="assets/history/:id" element={<ImageHistoryDetail />} />
						<Route path="assets/reels" element={<ReelsHistory />} />
						<Route path="reels-history" element={<ReelsHistory />} />
				</Route>

				{/* Fallback */}
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	</ErrorBoundary>
	)
}