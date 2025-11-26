import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import Card from '../components/shared/Card.jsx'
import Button from '../components/shared/Button.jsx'
import Input from '../components/shared/Input.jsx'
import LoadingSpinner from '../components/shared/LoadingSpinner.jsx'

const LoginPage = () => {
  const { login } = useAuth()
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showDemoCredentials, setShowDemoCredentials] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const result = login(credentials)
    
    if (!result.success) {
      setError(result.error)
    }
    
    setIsLoading(false)
  }

  const handleChange = (field, value) => {
    setCredentials(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const quickLogin = (username, password) => {
    setCredentials({ username, password })
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-success-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-success-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-6xl flex items-center justify-center gap-12 relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col items-start text-white max-w-lg">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center text-5xl shadow-2xl">
                💊
              </div>
              <div>
                <h1 className="text-5xl font-bold mb-2 drop-shadow-lg">
                  Medicine Tracker
                </h1>
                <p className="text-xl text-primary-100">
                  Professional Healthcare Management
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg">
                ⏰
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Smart Reminders</h3>
                <p className="text-primary-100">Never miss a dose with intelligent notifications</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg">
                📊
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Track Progress</h3>
                <p className="text-primary-100">Monitor adherence and health outcomes</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg">
                🔒
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Secure & Private</h3>
                <p className="text-primary-100">Your health data stays safe and confidential</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 text-sm text-primary-100">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>Multi-User Support</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>Real-time Alerts</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl text-4xl mb-4 shadow-2xl">
              💊
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
              Medicine Tracker
            </h1>
            <p className="text-primary-100">
              Professional Healthcare Management
            </p>
          </div>

          {/* Login Card */}
          <Card className="shadow-2xl backdrop-blur-sm bg-white/95">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                  Welcome Back
                </h2>
                <p className="text-sm text-neutral-600">
                  Sign in to access your dashboard
                </p>
              </div>

              {error && (
                <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 flex items-start gap-3 animate-shake">
                  <span className="text-danger-500 text-xl flex-shrink-0">⚠️</span>
                  <p className="text-danger-800 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <Input
                  label="Username"
                  required
                  value={credentials.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  placeholder="Enter your username"
                  disabled={isLoading}
                />

                <Input
                  label="Password"
                  type="password"
                  required
                  value={credentials.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isLoading || !credentials.username || !credentials.password}
                className="h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="small" color="white" />
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Sign In</span>
                    <span>→</span>
                  </div>
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  {showDemoCredentials ? '✕ Hide' : '👁️ View'} Demo Credentials
                </button>
              </div>
            </form>
          </Card>

          {/* Demo Credentials - Collapsible */}
          {showDemoCredentials && (
            <Card className="mt-4 shadow-xl backdrop-blur-sm bg-white/95 animate-slideDown">
              <div>
                <h3 className="font-semibold text-neutral-800 mb-4 text-center flex items-center justify-center gap-2">
                  <span>🎭</span>
                  <span>Demo Accounts</span>
                </h3>
                <div className="space-y-3 text-sm">
                  {/* Admin */}
                  <button
                    type="button"
                    onClick={() => quickLogin('admin', 'admin123')}
                    className="w-full bg-gradient-to-r from-primary-50 to-primary-100 hover:from-primary-100 hover:to-primary-200 p-4 rounded-lg border border-primary-200 transition-all hover:shadow-md text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">👑</span>
                        <div>
                          <div className="font-semibold text-neutral-800">Administrator</div>
                          <div className="text-xs text-neutral-600 mt-0.5">admin / admin123</div>
                        </div>
                      </div>
                      <span className="text-xs text-primary-600 font-medium">Click to use →</span>
                    </div>
                    <p className="text-xs text-neutral-600 ml-11">
                      Full access - Edit, delete, manage everything
                    </p>
                  </button>

                  {/* Caregiver */}
                  <button
                    type="button"
                    onClick={() => quickLogin('caregiver', 'care123')}
                    className="w-full bg-gradient-to-r from-success-50 to-success-100 hover:from-success-100 hover:to-success-200 p-4 rounded-lg border border-success-200 transition-all hover:shadow-md text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">👨‍⚕️</span>
                        <div>
                          <div className="font-semibold text-neutral-800">Caregiver</div>
                          <div className="text-xs text-neutral-600 mt-0.5">caregiver / care123</div>
                        </div>
                      </div>
                      <span className="text-xs text-success-600 font-medium">Click to use →</span>
                    </div>
                    <p className="text-xs text-neutral-600 ml-11">
                      Manage medicines, mark doses, view all data
                    </p>
                  </button>

                  {/* Family */}
                  <button
                    type="button"
                    onClick={() => quickLogin('family', 'family123')}
                    className="w-full bg-gradient-to-r from-info-50 to-info-100 hover:from-info-100 hover:to-info-200 p-4 rounded-lg border border-info-200 transition-all hover:shadow-md text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">👨‍👩‍👧</span>
                        <div>
                          <div className="font-semibold text-neutral-800">Family Member</div>
                          <div className="text-xs text-neutral-600 mt-0.5">family / family123</div>
                        </div>
                      </div>
                      <span className="text-xs text-info-600 font-medium">Click to use →</span>
                    </div>
                    <p className="text-xs text-neutral-600 ml-11">
                      View schedules and mark doses only
                    </p>
                  </button>
                </div>
              </div>
            </Card>
          )}

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-white/80">
            <p className="flex items-center justify-center gap-2">
              <span>🔒</span>
              <span>Secure</span>
              <span>•</span>
              <span>🔐</span>
              <span>Private</span>
              <span>•</span>
              <span>⚡</span>
              <span>Professional</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
