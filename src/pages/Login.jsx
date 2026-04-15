import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    const err = await signIn(email, password);
    if (err) setError('Email ou senha incorretos.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="bg-panel border border-border rounded-xl p-10 w-full max-w-sm shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://i.postimg.cc/X74TBk78/Design-sem-nome-(6).png"
            alt="Foco.ia"
            className="w-32 mb-2"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-grayText uppercase mb-1 block">Email</label>
            <input
              type="email"
              className="w-full bg-dark border border-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-gold"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <div>
            <label className="text-xs text-grayText uppercase mb-1 block">Senha</label>
            <input
              type="password"
              className="w-full bg-dark border border-border rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-gold"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gold text-black font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </div>
    </div>
  );
}