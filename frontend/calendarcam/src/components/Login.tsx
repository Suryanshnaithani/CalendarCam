import { useAuth } from '../context/AuthContext'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'

const Login = () => {
  const { login } = useAuth()

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="text-center">
        <Calendar className="w-16 h-16 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
        <p className="text-muted-foreground mb-6">Sign in to access your events and photos</p>
        <Button onClick={login} size="lg">
          Login with Google
        </Button>
      </div>
    </div>
  )
}

export default Login

