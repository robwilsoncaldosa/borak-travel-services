"use client"

import { useState } from "react"
import { LoginForm } from "@/app/admin/login/_components/login-form"
import { RegisterForm } from "@/app/admin/login/_components/register-form"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const [showLogin, setShowLogin] = useState(true)

  const toggleForm = () => {
    setShowLogin(!showLogin)
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl relative overflow-hidden rounded-lg border shadow-lg bg-background">
        <div className="grid md:grid-cols-1 relative">
          {/* Login Form */}
          <div className={cn(
            "transition-all duration-500 ease-in-out",
            showLogin ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          )}>
            <LoginForm onRegisterClick={toggleForm} hideImage />
          </div>
          
          {/* Register Form */}
          <div className={cn(
            "absolute inset-0 transition-all duration-500 ease-in-out",
            !showLogin ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          )}>
            <RegisterForm onLoginClick={toggleForm} hideImage />
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
            <img
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
