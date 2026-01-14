import SignInForm from '@/components/SignInForm'

function SignPage() {
  return (
	    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground">Login in to your account to continue</p>
          </div>
          <SignInForm />
        </div>
      </div>
    </main>
  )
}

export default SignPage