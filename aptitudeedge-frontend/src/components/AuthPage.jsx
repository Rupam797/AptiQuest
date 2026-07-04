import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('username') || '');

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(localStorage.getItem('username') || '');
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  useEffect(() => {
    if (mode === 'register') {
      setPasswordCriteria({
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        specialChar: /[@$!%*?&#]/.test(password),
      });
    }
  }, [password, mode]);

  const submit = async (event) => {
    event.preventDefault();
    if (mode === 'register') {
      const isStrong = passwordCriteria.length &&
                       passwordCriteria.uppercase &&
                       passwordCriteria.lowercase &&
                       passwordCriteria.number &&
                       passwordCriteria.specialChar;
      if (!isStrong) {
        setMessage("Error: Password does not meet complexity requirements.");
        return;
      }
    }

    try {
      const payload = mode === 'login'
        ? { username, password }
        : { username, email, password };
      const url = mode === 'login' ? '/auth/login' : '/auth/register';
      const response = await api.post(url, payload);
      
      const token = response.data.token;
      const responseUsername = response.data.username;
      const role = response.data.role;
      
      localStorage.setItem('token', token);
      localStorage.setItem('username', responseUsername);
      localStorage.setItem('role', role);
      setCurrentUser(responseUsername);
      setMessage(`Success: Welcome ${responseUsername}!`);
      
      window.dispatchEvent(new Event('auth-change'));
      
      setUsername('');
      setEmail('');
      setPassword('');
      
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error: Request failed');
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error("Logout request failed", e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      setCurrentUser('');
      setMessage('Logged out successfully');
      window.dispatchEvent(new Event('auth-change'));
    }
  };

  if (currentUser) {
    return (
      <div className="bg-white p-8 border-2 border-terminal-black pixel-corners shadow-[6px_6px_0px_#0F172A] max-w-md mx-auto text-center">
        <h1 className="text-3xl font-display-pixel uppercase text-terminal-black mb-4">Welcome back!</h1>
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-[10px] bg-primary-container text-white font-label-mono px-2.5 py-1 border border-terminal-black uppercase">
            Active Session
          </span>
          <span className="text-sm font-label-mono font-bold text-terminal-black">{currentUser}</span>
        </div>
        
        <p className="mt-4 text-ui-slate text-sm font-body-md">You are successfully logged in and authenticated.</p>
        
        {message && (
          <div className={`mt-6 p-4 text-xs font-label-mono border-2 pixel-corners ${
            message.toLowerCase().includes('success')
              ? 'bg-emerald-50 border-success-green text-emerald-950'
              : 'bg-surface-container border-terminal-black text-terminal-black'
          }`}>
            {message}
          </div>
        )}
        
        <button
          onClick={logout}
          className="mt-6 w-full bg-red-600 text-white hover:bg-red-700 px-4 py-3.5 font-label-mono uppercase border-2 border-terminal-black pixel-corners shadow-[3px_3px_0px_#0F172A] active:translate-y-0.5 active:shadow-[1px_1px_0px_#0F172A] transition-all"
        >
          Logout Session
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 border-2 border-terminal-black pixel-corners shadow-[6px_6px_0px_#0F172A] max-w-md mx-auto">
      <h1 className="text-3xl font-display-pixel uppercase text-terminal-black">{mode === 'login' ? 'Sign In' : 'Create Account'}</h1>
      <p className="text-ui-slate text-xs font-label-mono mt-1 uppercase">
        {mode === 'login' ? 'Access your practice history & rankings.' : 'Get started with your aptitude prep today.'}
      </p>
      
      <div className="mt-6 flex border-2 border-terminal-black p-1 bg-surface-container pixel-corners-sm">
        <button
          className={`flex-1 py-2 font-label-mono text-xs uppercase pixel-corners-sm transition duration-150 ${mode === 'login' ? 'bg-primary text-white shadow-[2px_2px_0px_#0F172A]' : 'text-ui-slate hover:text-terminal-black'}`}
          onClick={() => { setMode('login'); setMessage(''); }}
        >
          Login
        </button>
        <button
          className={`flex-1 py-2 font-label-mono text-xs uppercase pixel-corners-sm transition duration-150 ${mode === 'register' ? 'bg-primary text-white shadow-[2px_2px_0px_#0F172A]' : 'text-ui-slate hover:text-terminal-black'}`}
          onClick={() => { setMode('register'); setMessage(''); }}
        >
          Register
        </button>
      </div>
      
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <div>
          <label className="block text-xs font-label-mono font-bold text-terminal-black uppercase">
            {mode === 'login' ? 'Username or Email' : 'Username'}
          </label>
          <input
            className="mt-1.5 w-full bg-surface-container border-2 border-terminal-black px-4 py-2.5 focus:bg-white focus:border-primary focus:ring-0 outline-none text-sm font-body-md pixel-corners"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={mode === 'login' ? 'e.g. user or user@gmail.com' : 'e.g. username'}
            required
          />
        </div>
        
        {mode === 'register' && (
          <div>
            <label className="block text-xs font-label-mono font-bold text-terminal-black uppercase">Email Address</label>
            <input
              type="email"
              className="mt-1.5 w-full bg-surface-container border-2 border-terminal-black px-4 py-2.5 focus:bg-white focus:border-primary focus:ring-0 outline-none text-sm font-body-md pixel-corners"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@gmail.com"
              required
            />
          </div>
        )}
        
        <div>
          <label className="block text-xs font-label-mono font-bold text-terminal-black uppercase">Password</label>
          <input
            type="password"
            className="mt-1.5 w-full bg-surface-container border-2 border-terminal-black px-4 py-2.5 focus:bg-white focus:border-primary focus:ring-0 outline-none text-sm font-body-md pixel-corners"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        {mode === 'register' && (
          <div className="mt-3 text-xs space-y-1.5 bg-surface-container p-4 border-2 border-terminal-black pixel-corners">
            <p className="font-label-mono font-bold text-terminal-black uppercase mb-1">Requirements:</p>
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 border border-terminal-black pixel-corners-sm transition-colors duration-200 ${passwordCriteria.length ? 'bg-success-green' : 'bg-white'}`}></span>
              <span className={`font-label-mono text-[10px] uppercase ${passwordCriteria.length ? 'text-success-green font-bold' : 'text-ui-slate'}`}>8+ characters</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 border border-terminal-black pixel-corners-sm transition-colors duration-200 ${passwordCriteria.uppercase ? 'bg-success-green' : 'bg-white'}`}></span>
              <span className={`font-label-mono text-[10px] uppercase ${passwordCriteria.uppercase ? 'text-success-green font-bold' : 'text-ui-slate'}`}>1+ uppercase</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 border border-terminal-black pixel-corners-sm transition-colors duration-200 ${passwordCriteria.lowercase ? 'bg-success-green' : 'bg-white'}`}></span>
              <span className={`font-label-mono text-[10px] uppercase ${passwordCriteria.lowercase ? 'text-success-green font-bold' : 'text-ui-slate'}`}>1+ lowercase</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 border border-terminal-black pixel-corners-sm transition-colors duration-200 ${passwordCriteria.number ? 'bg-success-green' : 'bg-white'}`}></span>
              <span className={`font-label-mono text-[10px] uppercase ${passwordCriteria.number ? 'text-success-green font-bold' : 'text-ui-slate'}`}>1+ digit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 border border-terminal-black pixel-corners-sm transition-colors duration-200 ${passwordCriteria.specialChar ? 'bg-success-green' : 'bg-white'}`}></span>
              <span className={`font-label-mono text-[10px] uppercase ${passwordCriteria.specialChar ? 'text-success-green font-bold' : 'text-ui-slate'}`}>1+ special char</span>
            </div>
          </div>
        )}

        <button className="w-full mt-4 bg-primary text-white hover:bg-terminal-black border-2 border-terminal-black px-4 py-3 font-label-mono uppercase pixel-corners shadow-[3px_3px_0px_#0F172A] active:translate-y-0.5 active:shadow-[1px_1px_0px_#0F172A] transition-all">
          {mode === 'login' ? 'Login' : 'Sign Up'}
        </button>

        {message && (
          <div className={`mt-4 p-4 text-xs font-label-mono border-2 pixel-corners ${
            message.toLowerCase().includes('success')
              ? 'bg-emerald-50 border-success-green text-emerald-950'
              : 'bg-red-50 border-error text-red-950'
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default AuthPage;
