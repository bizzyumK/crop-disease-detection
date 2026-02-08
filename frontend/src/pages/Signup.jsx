import signupImg from '../assets/login.webp';
import { useNavigate } from 'react-router-dom';

const Signup = () => {

  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full bg-[#0d140d] flex items-center justify-center overflow-hidden px-6">
      
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-900/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/20 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-white tracking-tight mb-1">
            Create Account
          </h1>
        </div>

        {/* Image */}
        <div className="mb-4">
          <img
            src={signupImg}
            alt="signup"
            className="w-50 object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          />
        </div>


        <form className="w-full space-y-3">
          {[
            { label: 'Full Name', type: 'text', placeholder: 'Enter your name' },
            { label: 'Email', type: 'email', placeholder: 'Enter your email' },
            { label: 'Password', type: 'password', placeholder: '••••••••' },
            { label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
          ].map((field) => (
            <div key={field.label} className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest ml-1">
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-white text-black font-bold py-3 rounded-full mt-3 active:scale-[0.98] hover:bg-zinc-200 transition-all shadow-lg shadow-white/5"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-zinc-400 text-sm">
          Already have an account?
          <button className="ml-2 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
          onClick={()=>navigate('/signin')}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;