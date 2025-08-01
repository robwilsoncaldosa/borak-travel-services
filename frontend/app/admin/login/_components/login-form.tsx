import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image";
import { useState } from "react"

interface LoginFormProps {
  onRegisterClick: () => void;
  hideImage?: boolean;
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading?: boolean;
  onClearError?: () => void;
}

export function LoginForm({ hideImage, onSubmit, isLoading, onClearError }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Add form handling logic here
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Add name attributes to form inputs
    await onSubmit(email, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-600 font-medium">Signing you in...</p>
          </div>
        </div>
      )}
      <Card className="overflow-hidden p-0 border-0 shadow-none bg-transparent">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Borak Travel Services account
                </p>
              </div>
              
              {/* Rest of the form remains the same */}
              <div className="grid gap-3 ">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email" // Add name attribute
                  type="email"
                  placeholder="m@example.com"
                  required
                  disabled={isLoading}
                  onChange={() => onClearError?.()}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <div className="relative">
                  <Input 
                    id="password"
                    name="password" // Add name attribute
                    type={showPassword ? "text" : "password"}
                    required 
                    disabled={isLoading}
                    className="pr-10"
                    onChange={() => onClearError?.()}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing you in...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
              
              {/* Social login section - hidden but space preserved */}
              <div className="invisible h-[75px]">
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {/* Social login buttons hidden */}
                </div>
              </div>
              
             
            </div>
          </form>
          
          {/* Image is now handled by the parent component */}
          {!hideImage && (
            <div className="bg-muted relative hidden md:block">
              <Image
              width={1000}
              height={1000}
                src="/placeholder.svg"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
