'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipoUsuario?: 'CLIENTE' | 'ADMIN';
}

export default function RegisterModal({ isOpen, onClose, tipoUsuario = 'CLIENTE' }: RegisterModalProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (tipoUsuario === 'CLIENTE' && senha !== confirmSenha) {
      setError('As senhas não correspondem');
      return;
    }

    setLoading(true);
    
    const senhaFinal = tipoUsuario === 'ADMIN' ? 'Admin@123' : senha;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          email,
          senha: senhaFinal,
          tipoUsuario
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.erro || 'Falha ao cadastrar');
      }

      toast.success('Cadastro realizado com sucesso!');
      onClose();
      setNome('');
      setEmail('');
      setSenha('');
      setConfirmSenha('');
    } catch (_err: unknown) {
      if (_err instanceof Error) {
        setError(_err.message);
      } else {
        setError('Ocorreu um erro ao cadastrar');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative z-10">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">
              {tipoUsuario === 'ADMIN' ? 'Cadastrar Administrador' : 'Cadastre-se'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              &times;
            </button>
          </div>
          
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          {tipoUsuario === 'ADMIN' && (
            <p className="text-blue-600 mb-4">
              O administrador será cadastrado com a senha padrão: Admin@123
            </p>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            
            {tipoUsuario === 'CLIENTE' && (
              <>
                <div>
                  <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <input
                    type="password"
                    id="senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmSenha" className="block text-sm font-medium text-gray-700">
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    id="confirmSenha"
                    value={confirmSenha}
                    onChange={(e) => setConfirmSenha(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    required
                  />
                </div>
              </>
            )}
            
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white py-2 px-6 rounded-md font-medium hover:bg-green-700 transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? 'Cadastrando...' : tipoUsuario === 'ADMIN' ? 'Cadastrar Administrador' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
