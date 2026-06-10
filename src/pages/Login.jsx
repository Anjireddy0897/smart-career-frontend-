import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f7f8fa',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #ec4899 100%)',
          padding: '16px 20px',
          paddingTop: '28px',
          color: 'white',
          borderRadius: '0 0 0 0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '6px',
            }}
            aria-label="back"
          >
            ←
          </button>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>
            Career Planner
          </h1>
          <div style={{ flex: 1 }} />
          <div
            style={{
              width: '26px',
              height: '14px',
              border: '1.5px solid white',
              borderRadius: '3px',
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '40px 28px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '34px', fontWeight: 800, color: '#0f172a' }}>
          Welcome Back!
        </h2>
        <p style={{ marginTop: 12, marginBottom: 28, color: '#6b7280', fontSize: '16px' }}>
          Sign in to continue your career journey
        </p>

        <div style={{ width: '100%', maxWidth: 520 }}>
          <label style={{ display: 'block', fontSize: 14, color: '#374151', marginBottom: 8 }}>
            Email
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'white', borderRadius: 12, padding: '14px 16px', border: '1px solid #e6e7ea', marginBottom: 18 }}>
            <span style={{ fontSize: 18, color: '#9ca3af' }}>✉️</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{ border: 'none', outline: 'none', flex: 1, fontSize: 16 }}
            />
          </div>

          <label style={{ display: 'block', fontSize: 14, color: '#374151', marginBottom: 8 }}>
            Password
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'white', borderRadius: 12, padding: '14px 16px', border: '1px solid #e6e7ea', marginBottom: 12 }}>
            <span style={{ fontSize: 18, color: '#9ca3af' }}>🔒</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{ border: 'none', outline: 'none', flex: 1, fontSize: 16 }}
            />
            <button style={{ background: 'none', border: 'none', fontSize: 18, color: '#9ca3af', cursor: 'pointer' }} aria-label="toggle-password">
              👁️
            </button>
          </div>

          <div style={{ marginBottom: 18 }}>
            <button onClick={() => navigate('/forgot')} style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', padding: 0 }}>
              Forgot Password?
            </button>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: 14,
              border: 'none',
              color: 'white',
              fontSize: 18,
              fontWeight: 600,
              background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 60%)',
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>

          <p style={{ textAlign: 'center', color: '#6b7280', marginTop: 18 }}>
            Don't have an account?{' '}
            <button onClick={() => navigate('/register')} style={{ background: 'none', border: 'none', color: '#8b5cf6', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;