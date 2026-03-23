import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiBookOpen, FiStar, FiAward, FiArrowRight, FiShield, FiUser, FiMail, FiLock } from 'react-icons/fi';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(username, password);
        navigate('/dashboard');
      } else {
        await register(username, password, role);
        setIsLogin(true);
        setSuccess('Registration successful! Please sign in.');
        setPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-split-container">
      {/* Left Section: Branding & Features */}
      <div className="login-left-panel">
        <div className="branding-top">
          <div className="logo-wrap">
            <span className="logo-icon-main">E</span>
            <span className="logo-text-main">EduTrack</span>
          </div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            <span className="highlight-text">Empower Education,</span> <br />
            Simplify Management <span className="sparkle">✨</span>
          </h1>

          <div className="feature-cards-wrap">
            <div className="login-feature-card">
              <div className="f-icon-box"><FiAward /></div>
              <div className="f-text">
                <h3>Track Achievement <span className="sparkle-mini">✨</span></h3>
                <p>Monitor academic progress with detailed analytical insights</p>
              </div>
            </div>

            <div className="login-feature-card">
              <div className="f-icon-box"><FiShield /></div>
              <div className="f-text">
                <h3>Secure Access</h3>
                <p>Role-based authentication for students and faculty</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="floating-shape s1"></div>
        <div className="floating-shape s2"></div>
      </div>

      {/* Right Section: Form */}
      <div className="login-right-panel">
        <div className="login-form-box">
          <div className="form-header">
            <h2>{isLogin ? 'Welcome Back' : 'Join EduTrack'}</h2>
            <p>Enter your credentials to continue your academic journey with EduTrack</p>
          </div>

          <div className="mode-toggle">
            <button 
              className={isLogin ? 'active' : ''} 
              onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
            >
              Sign In
            </button>
            <button 
              className={!isLogin ? 'active' : ''} 
              onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
            >
              Register
            </button>
          </div>

          {error && <div className="login-error-msg">⚠️ {error}</div>}
          {success && <div className="login-success-msg">✅ {success}</div>}

          <form onSubmit={handleSubmit} className="actual-form">
            <div className="input-group-modern">
              <label><FiUser /> Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group-modern">
              <label><FiLock /> Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {!isLogin && (
              <div className="input-group-modern">
                <label><FiShield /> Select Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="STUDENT">Student Scholar</option>
                  <option value="TEACHER">Faculty Member</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
            )}

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? 'Processing...' : (isLogin ? 'Continue' : 'Create Account')}
              {!loading && <FiArrowRight />}
            </button>
          </form>

          <div className="form-footer">
            {isLogin ? (
              <p>Don't have an account? <span onClick={() => setIsLogin(false)}>Register here</span></p>
            ) : (
              <p>Already have an account? <span onClick={() => setIsLogin(true)}>Sign in here</span></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
