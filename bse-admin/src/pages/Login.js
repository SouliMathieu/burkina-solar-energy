import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading]     = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const { login }                 = useAuth();
  const navigate                  = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Connexion réussie !');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      {/* Card login */}
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Zap size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Burkina Solar Energy</h1>
          <p className="text-white/50 text-sm mt-1">Espace Administration</p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-dark mb-6 text-center">Connexion</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="admin@burkina-solar.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition
                    ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
                  {...register('email', {
                    required: 'Email obligatoire',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email invalide' }
                  })}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition
                    ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
                  {...register('password', { required: 'Mot de passe obligatoire' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connexion...
                </>
              ) : 'Se connecter'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          © 2026 Burkina Solar Energy — Administration
        </p>
      </div>
    </div>
  );
};

export default Login;