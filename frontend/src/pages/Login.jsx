<<<<<<< HEAD
import loginImg from '../assets/login.webp';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { loginUser } from '../api/auth.api';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
=======
import React, { useState } from 'react';
import loginImg from '../assets/login.webp';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';


const Login = () => {

  const navigate = useNavigate();
  const {login} = useAuth();

  const [form,setForm] = useState({
    email: '',
    password: '',
  });

  const[loading,setLoading] = useState(false);
  const [error,setError] = useState('');

  const handleChange = (e) =>{
    setForm({...form,[e.target.name]: e.target.value});
  };

  const handleSubmit = async (e)=>{
>>>>>>> Subodh-Dhamala-subodh
    e.preventDefault();
    setError('');
    setLoading(true);

<<<<<<< HEAD
    try {
      const res = await loginUser({ email, password });

      // Store token + user info
      localStorage.setItem('token', res.data.token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
        })
      );

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
=======
    try{
      await login(form); 
      navigate('/dashboard');
    } catch(err){
      setError('Invalid email or password');
    }
    finally{
>>>>>>> Subodh-Dhamala-subodh
      setLoading(false);
    }
  };

<<<<<<< HEAD
=======

>>>>>>> Subodh-Dhamala-subodh
  return (
    <div className="relative min-h-screen w-full bg-[#0d140d] flex items-center justify-center overflow-hidden px-6">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-900/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/20 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
<<<<<<< HEAD
        <h1 className="text-4xl font-bold text-white mb-2">Welcome Back!</h1>

        <img src={loginImg} alt="login" className="w-80 h-75 object-contain mb-8" />

        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder:text-zinc-600"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder:text-zinc-600"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-4 rounded-full mt-4 hover:bg-zinc-200"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

=======
        
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Welcome Back!</h1>
        </div>

        {/*bidu Image */}
        <div className="mb-8">
          <img
            src={loginImg}
            alt="bidu"
            className="w-80 h-75 object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          />
        </div>

        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest ml-1">
              Email
            </label>
            <input 
              type="email" 
              name='email'
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest ml-1">
              Password
            </label>
            <input 
              type="password" 
              name='password'
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all outline-none"
            />
          </div>

          {error && (
            <p className='text-sm text-red-400 text-center'>
              {error}
            </p>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-4 rounded-full mt-4 active:scale-[0.98] hover:bg-zinc-200 transition-all shadow-lg shadow-white/5"
          >
            {loading ? 'Logging in...': 'Login'}
          </button>
        </form>

<<<<<<< HEAD
    
        <p className="mt-8 text-zinc-400 text-sm">
          Don't have an account? 
          <button className="ml-2 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
            onClick={()=>navigate('/register')}
          >
            Register
=======
>>>>>>> Subodh-Dhamala-subodh
        {/* Fixed signup footer */}
        <p className="mt-6 text-zinc-400 text-sm text-center">
          Don't have an account?
          <button
            className="ml-2 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
            onClick={() => navigate('/signup')}
          >
            Sign up
<<<<<<< HEAD
=======
>>>>>>> 0d5b6c05a (login footer fixed(stupid))
>>>>>>> Subodh-Dhamala-subodh
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
