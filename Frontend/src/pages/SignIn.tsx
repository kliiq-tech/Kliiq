import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card'
import { Link } from 'react-router-dom'

export function SignIn() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <Link to="/" className="mb-8 text-2xl font-bold bg-brand-gradient bg-clip-text text-transparent">
                Kliiq
            </Link>
            <Card className="w-full max-w-md bg-surface/50 border-white/10 backdrop-blur-xl">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl text-white">Welcome back to Kliiq</CardTitle>
                    <p className="text-sm text-text-secondary">Enter your email and password to sign in</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Email</label>
                        <Input type="email" placeholder="name@example.com" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-text-secondary">Password</label>
                            <a href="#" className="text-sm text-primary hover:text-primary/80">Forgot password?</a>
                        </div>
                        <Input type="password" />
                    </div>
                    <Button className="w-full">Sign in</Button>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-text-secondary">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary hover:text-primary/80 font-medium">
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
