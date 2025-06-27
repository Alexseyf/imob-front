'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface PasswordRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PasswordRecoveryModal({ isOpen, onClose }: PasswordRecoveryModalProps) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recupera-senha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar email');
      }

      toast.success('Código enviado para seu email');
      setStep(2);
    } catch (_) {
      toast.error('Erro ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (novaSenha !== confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }

    if (novaSenha.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/valida-senha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code, novaSenha }),
      });

      if (!response.ok) {
        throw new Error('Falha ao validar código');
      }

      toast.success('Senha alterada com sucesso');
      onClose();
    } catch (_) {
      toast.error('Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-96 relative z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recuperar Senha</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ✕
            </button>
          </div>

          {step === 1 ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-100 text-black py-2 px-4 rounded hover:bg-orange-200 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Enviando...' : 'Enviar Código'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Código de 4 dígitos:
                </label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={4}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  Nova Senha:
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar Nova Senha:
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-100 text-black py-2 px-4 rounded hover:bg-orange-200 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Alterando...' : 'Alterar Senha'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 