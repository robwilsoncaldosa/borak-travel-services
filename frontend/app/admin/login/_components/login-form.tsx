import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginFormProps {
  onRegisterClick: () => void;
  hideImage?: boolean;
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading?: boolean;
}

export function LoginForm({ onRegisterClick, hideImage, onSubmit, isLoading }: LoginFormProps) {
  // Add form handling logic here
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Add name attributes to form inputs
    await onSubmit(email, password);
  };

  return (
    <div className="flex flex-col">
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
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email" // Add name attribute
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password"
                  name="password" // Add name attribute
                  type="password" 
                  required 
                />
              </div>
              <Button type="submit" className="w-full">
                Login
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
              
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a 
                  href="#" 
                  className="underline underline-offset-4"
                  onClick={(e) => {
                    e.preventDefault()
                    onRegisterClick?.()
                  }}
                >
                  Sign up
                </a>
              </div>
            </div>
          </form>
          
          {/* Image is now handled by the parent component */}
          {!hideImage && (
            <div className="bg-muted relative hidden md:block">
              <img
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
