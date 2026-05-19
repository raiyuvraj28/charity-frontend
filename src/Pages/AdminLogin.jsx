import React, { useState } from 'react';
import { API_BASE_URL } from '../config/api';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('role', 'admin');
        localStorage.setItem('token', data.token);
        window.location.href = '/admin';
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Could not connect to server. Ensure backend is running.');
    }
  };

  return (
    <section className="login-section d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', paddingTop: '80px' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8 col-12">
            <div className="glass-card p-5 animate-fade-in-up" style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)' }}>
              <div className="text-center mb-4">
                <div className="mb-3 d-inline-block p-3 rounded-circle" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent)' }}>
                  <i className="bi-shield-lock" style={{ fontSize: '2.5rem' }}></i>
                </div>
                <h2 className="text-white mb-2">Admin Portal</h2>
                <p className="text-white-50">Authorized personnel only</p>
              </div>

              {error && <div className="alert alert-danger py-2">{error}</div>}

              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <input type="email" className="form-control premium-input-dark w-100" placeholder="Admin Email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="mb-4 position-relative">
                  <input type={showPassword ? "text" : "password"} className="form-control premium-input-dark w-100" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                  <button type="button" className="btn border-0 position-absolute top-50 end-0 translate-middle-y text-muted pe-3" onClick={() => setShowPassword(!showPassword)} style={{ boxShadow: 'none' }}>
                    <i className={showPassword ? "bi bi-eye-slash-fill" : "bi bi-eye-fill"}></i>
                  </button>
                </div>
                
                <button type="submit" className="btn-premium btn-accent w-100 mt-2">
                  Access Dashboard
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
