'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';

interface AgendarVisitaModalProps {
  isOpen: boolean;
  onClose: () => void;
  imovelId: number;
}

export default function AgendarVisitaModal({ isOpen, onClose, imovelId }: AgendarVisitaModalProps) {
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [loading, setLoading] = useState(false);
  
  const horariosDisponiveis = Array.from({ length: 11 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });
  
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!data || !hora) {
      toast.error('Por favor, selecione uma data e um horário para a visita');
      return;
    }
    
    const dataHora = new Date(`${data}T${hora}:00`);

    const agora = new Date();
    if (dataHora < agora) {
      toast.error('Por favor, selecione uma data e horário futuros');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/agendamentos/solicitar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          data: dataHora.toISOString(),
          imovelId: imovelId
        }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.erro || 'Falha ao agendar visita');
      }
      
      toast.success('Visita agendada com sucesso!');
      onClose();
    } catch (error) {
      console.error('Erro ao agendar visita:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao agendar visita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-6">Agendar Visita</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="data" className="block text-sm font-medium mb-1">
              Data da visita
            </label>
            <input
              type="date"
              id="data"
              value={data}
              onChange={(e) => setData(e.target.value)}
              min={minDate}
              max={maxDateStr}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="hora" className="block text-sm font-medium mb-1">
              Hora da visita
            </label>
            <select
              id="hora"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecione um horário</option>
              {horariosDisponiveis.map((horario) => (
                <option key={horario} value={horario}>
                  {horario}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Agendando...' : 'Agendar visita'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}