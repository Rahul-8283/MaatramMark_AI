import { Navigate } from 'react-router-dom'
import useStore from '../store/useStore.ts'

type Props = {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const userId = useStore((s) => s.userId)
  const storedUserId = localStorage.getItem('userId')

  if (!userId && !storedUserId) {
    // When returning from Google OAuth, the tokens are in the URL hash.
    // It takes a split second for App.tsx to process them. 
    // We shouldn't kick the user out while this is happening.
    if (window.location.hash.includes('access_token')) {
      return (
        <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center text-[#c5a880]">
          Authenticating...
        </div>
      )
    }
    
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
