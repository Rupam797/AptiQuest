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

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(localStorage.getItem('username') || '');
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const submit = async (event) => {
    event.preventDefault();
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
      
      // Dispatch event to notify other components of auth status change
      window.dispatchEvent(new Event('auth-change'));
      
      // Clear input fields
      setUsername('');
      setEmail('');
      setPassword('');
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Request failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setCurrentUser('');
    setMessage('Logged out successfully');
    window.dispatchEvent(new Event('auth-change'));
  };

  if (currentUser) {
    return (
      <div className="rounded-xl bg-white p-8 shadow-md max-w-md mx-auto text-center">
        <h1 className="text-2xl font-semibold text-slate-800">Welcome, {currentUser}!</h1>
        <p className="mt-2 text-slate-600">You are successfully logged in.</p>
        {message && <div className="mt-4 rounded-lg bg-slate-100 p-3 text-sm text-slate-700">{message}</div>}
        <button
          onClick={logout}
          className="mt-6 w-full rounded-xl bg-red-600 px-4 py-3 text-white font-medium hover:bg-red-700 transition duration-150"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-8 shadow-md max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-slate-800">{mode === 'login' ? 'Login' : 'Register'}</h1>
      <div className="mt-4 flex gap-3">
        <button
          className={`rounded-full px-4 py-2 text-sm font-medium transition duration-150 ${mode === 'login' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
          onClick={() => setMode('login')}
        >
          Login
        </button>
        <button
          className={`rounded-full px-4 py-2 text-sm font-medium transition duration-150 ${mode === 'register' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
          onClick={() => setMode('register')}
        >
          Register
        </button>
      </div>
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            {mode === 'login' ? 'Username or Email' : 'Username'}
          </label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={mode === 'login' ? 'e.g. user or user@gmail.com' : 'e.g. user'}
            required
          />
        </div>
        {mode === 'register' && (
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="w-full rounded-xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-800 transition duration-150">Submit</button>
        {message && <div className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700">{message}</div>}
      </form>
    </div>
  );
}

export default AuthPage;
