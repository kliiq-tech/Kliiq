import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card'
import { Link } from 'react-router-dom'

export function SignUp() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <Link to="/" className="mb-8 text-2xl font-bold bg-brand-gradient bg-clip-text text-transparent">
                Kliiq
            </Link>
            <Card className="w-full max-w-md bg-surface/50 border-white/10 backdrop-blur-xl">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl text-white">Create your Kliiq account</CardTitle>
                    <p className="text-sm text-text-secondary">Enter your details to get started</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Name</label>
                        <Input placeholder="John Doe" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Email</label>
                        <Input type="email" placeholder="name@example.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Password</label>
                        <Input type="password" />
                    </div>
                    <Button className="w-full">Create account</Button>
                </CardContent>
                <CardFooter className="flex-col space-y-4 text-center">
                    <p className="text-xs text-text-muted">
                        By signing up, you agree to Kliiq’s <a href="#" className="underline hover:text-white">Terms</a> & <a href="#" className="underline hover:text-white">Privacy Policy</a>.
                    </p>
                    <p className="text-sm text-text-secondary">
                        Already have an account?{' '}
                        <Link to="/signin" className="text-primary hover:text-primary/80 font-medium">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
