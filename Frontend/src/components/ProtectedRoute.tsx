import { Navigate } from 'react-router-dom'
import useStore from '../store/useStore.ts'

type Props = {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const userId = useStore((s) => s.userId)
  const storedUserId = localStorage.getItem('userId')

  if (!userId && !storedUserId) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
