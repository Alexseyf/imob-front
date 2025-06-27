'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import PasswordRecoveryModal from '@/components/PasswordRecoveryModal';
import RegisterModal from '@/components/RegisterModal';
import { useAuthStore } from '@/store/useAuthStore';

export default function Login() {  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');  
  const [error, setError] = useState('');
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const router = useRouter();
  const { setIsAuthenticated, setUserName, setUserEmail, setUserType } = useAuthStore();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao logar');
      }
      
      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('token', data.token);

        if (data.nome) {
          localStorage.setItem('userName', data.nome);
          setUserName(data.nome);
        } else {
          const userName = email.split('@')[0];
          localStorage.setItem('userName', userName);
          setUserName(userName);
        }

        localStorage.setItem('email', email);
        setUserEmail(email);

        const tipoUsuario = data.usuarioTipo || 'CLIENTE'; 
        localStorage.setItem('userType', tipoUsuario);
        setUserType(tipoUsuario);
        setIsAuthenticated(true);
        
        toast.success('Login realizado com sucesso');

        const redirectPath = localStorage.getItem('redirectAfterLogin');
        
        if (redirectPath) {

          localStorage.removeItem('redirectAfterLogin');

          router.push(redirectPath);
        } else if (tipoUsuario.toUpperCase() === 'ADMIN' || tipoUsuario.toUpperCase() === 'SUPORTE') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      }
    } catch {
      setError('Email ou senha inválida');
    }
  };

  return (
    <div className="login-container p-4 rounded shadow-md w-full max-w-md mx-auto mt-10 bg-white sm:mt-16 sm:p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form className="space-y-4" onSubmit={handleSubmit} autoComplete="on">
        <div className="form-group">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
            required
            autoFocus
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-base"
          />
        </div>
        <div className="form-group">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Senha:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-base"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="login-button bg-orange-500 text-white py-3 px-6 rounded shadow hover:bg-orange-600 transition-colors w-full sm:w-auto"
          >
            Login
          </button>
        </div>
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsRecoveryModalOpen(true)}
            className="text-orange-500 hover:underline text-sm mt-2"
          >
            Esqueceu sua senha?
          </button>
        </div>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Não possui conta?{' '}
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="text-orange-500 hover:underline font-medium"
          >
            Cadastre-se
          </button>
        </p>
      </div>

      <PasswordRecoveryModal
        isOpen={isRecoveryModalOpen}
        onClose={() => setIsRecoveryModalOpen(false)}
      />
      
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
}
