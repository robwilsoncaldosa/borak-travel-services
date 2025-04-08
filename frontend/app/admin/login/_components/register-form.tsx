import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RegisterFormProps extends React.ComponentProps<"div"> {
  onLoginClick?: () => void
  hideImage?: boolean
}

export function RegisterForm({
  className,
  onLoginClick,
  hideImage = false,
  ...props
}: RegisterFormProps) {
  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <Card className="overflow-hidden p-0 border-0 shadow-none bg-transparent">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* First column - Image */}
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1682687982501-1e58ab814714"
              alt="Borak Travel Services Registration"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              loading="lazy"
              width={1920}
              height={1080}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          
          {/* Second column - Form */}
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-muted-foreground text-balance">
                  Sign up for your Borak Travel Services account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
             
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a 
                  href="#" 
                  className="underline underline-offset-4"
                  onClick={(e) => {
                    e.preventDefault()
                    onLoginClick?.()
                  }}
                >
                  Login
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}