"use client"

import { LoginForm } from "@/app/admin/login/_components/login-form"
import { RegisterForm } from "@/app/admin/login/_components/register-form"
import { CustomAlert } from "@/components/ui/CustomAlert"
import { useAuth } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { isAuthenticated } from "@/lib/auth"
import Image from "next/image"


export default function LoginPage() {
  const [showLogin, setShowLogin] = useState(true)
  const { login, loading, error } = useAuth()
  const router = useRouter()
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  const toggleForm = () => {
    setShowLogin(!showLogin)
  }

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await login(email, password)
      if (result && isAuthenticated()) {
        toast.success('Login successful!')
        router.push('/admin/dashboard')
      } else {
        setAlertMessage(error || 'Login failed')
        setAlertOpen(true)
      }
    } 

    catch (error: unknown) {
      let errorMessage = 'Login failed';
      if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        errorMessage = err.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setAlertMessage(errorMessage);
      setAlertOpen(true);
    }
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <CustomAlert open={alertOpen} message={alertMessage} onClose={() => setAlertOpen(false)} />
      <div className="w-full max-w-sm md:max-w-3xl relative overflow-hidden rounded-lg border shadow-lg bg-background">
        <div className="grid md:grid-cols-1 relative">
          {/* Login Form */}
          <div className={cn(
            "transition-all duration-500 ease-in-out",
            showLogin ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          )}>
            <LoginForm 
              onRegisterClick={toggleForm} 
              hideImage 
              onSubmit={handleLogin}
              isLoading={loading}
            />
          </div>
          
          {/* Register Form */}
          <div className={cn(
            "absolute inset-0 transition-all duration-500 ease-in-out",
            !showLogin ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          )}>
            <RegisterForm onLoginClick={toggleForm} />
          </div>
          
          {/* Sliding Image Panel */}
          <motion.div 
            className="bg-muted relative hidden md:block md:absolute md:h-full"
            initial={false}
            animate={{ 
              right: showLogin ? "0%" : "50%",
              left: showLogin ? "50%" : "0%"
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Image
            width={1000}
            height={1000}
              src="https://images.unsplash.com/photo-1540339832862-474599807836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
              alt="Person with feet up in airport lounge with airplane visible through window"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10"></div>
          </motion.div>
        </div>
        
      </div>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 mt-6 p-4">
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
          and <a href="#">Privacy Policy</a>.
        </div>
    </div>
  )
}
