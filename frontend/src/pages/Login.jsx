import React from 'react';
import loginImg from '../assets/login.webp';

const Login = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#0d140d] flex items-center justify-center overflow-hidden px-6">
      
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-900/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/20 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        
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

        <form className="w-full space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest ml-1">
              Email
            </label>
            <input 
              type="email" 
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
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all outline-none"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-white text-black font-bold py-4 rounded-full mt-4 active:scale-[0.98] hover:bg-zinc-200 transition-all shadow-lg shadow-white/5"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-zinc-400 text-sm">
          Don't have an account? 
          <button className="ml-2 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;