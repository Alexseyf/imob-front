"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

enum TipoImovel {
  CASA = "CASA",
  APARTAMENTO = "APARTAMENTO",
  TERRENO = "TERRENO",
  COMERCIAL = "COMERCIAL",
  RURAL = "RURAL"
}

interface Admin {
  id: string;
  nome: string;
}

interface CadastrarImovelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CadastrarImovelModal({ isOpen, onClose }: CadastrarImovelModalProps) {
  const { checkAuth } = useAuthStore();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
      checkAuth();
    }
  }, [checkAuth]);

  const [formData, setFormData] = useState({
    area: '',
    valor: '',
    endereco: '',
    bairro: '',
    tipoImovel: TipoImovel.CASA,
    usuarioId: '',
    quarto: '',
    banheiro: '',
    cozinha: '',
    sala: '',
    garagem: '',
    suite: '',
    areaServico: '',
    foto: ''
  });

  useEffect(() => {
    if (isOpen && token) {
      fetchAdmins();
    }
  }, [isOpen, token]);

  const fetchAdmins = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/suporte/listar-admins`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao buscar administradores');
      }

      const data = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error('Erro ao buscar administradores:', error);
      toast.error('Não foi possível carregar a lista de administradores');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!token) {
      toast.error('Você precisa estar autenticado para cadastrar um imóvel');
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        area: Number(formData.area),
        valor: Number(formData.valor),
        endereco: formData.endereco,
        bairro: formData.bairro,
        tipoImovel: formData.tipoImovel,
        usuarioId: formData.usuarioId,
        quarto: Number(formData.quarto),
        banheiro: Number(formData.banheiro),
        cozinha: Number(formData.cozinha),
        sala: Number(formData.sala),
        garagem: Number(formData.garagem),
        suite: Number(formData.suite),
        areaServico: Number(formData.areaServico),
        foto: formData.foto,
        isArquivado: false
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/imoveis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Falha ao cadastrar imóvel');
      }

      toast.success('Imóvel cadastrado com sucesso!');
      onClose();
      setFormData({
        area: '',
        valor: '',
        endereco: '',
        bairro: '',
        tipoImovel: TipoImovel.CASA,
        usuarioId: '',
        quarto: '',
        banheiro: '',
        cozinha: '',
        sala: '',
        garagem: '',
        suite: '',
        areaServico: '',
        foto: ''
      });
    } catch (error) {
      console.error('Erro ao cadastrar imóvel:', error);
      toast.error('Erro ao cadastrar imóvel. Verifique os dados e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cadastrar Novo Imóvel</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Imóvel</label>
              <select
                name="tipoImovel"
                value={formData.tipoImovel}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                {Object.values(TipoImovel).map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Corretor Responsável</label>
              <select
                name="usuarioId"
                value={formData.usuarioId}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Selecione um corretor</option>
                {admins.map((admin) => (
                  <option key={admin.id} value={admin.id}>{admin.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Área (m²)</label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
              <input
                type="number"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
                min="1"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
              <input
                type="text"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
              <input
                type="text"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL da Foto</label>
              <input
                type="text"
                name="foto"
                value={formData.foto}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
                placeholder="http://example.com/imagem.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quartos</label>
              <input
                type="number"
                name="quarto"
                value={formData.quarto}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Banheiros</label>
              <input
                type="number"
                name="banheiro"
                value={formData.banheiro}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cozinhas</label>
              <input
                type="number"
                name="cozinha"
                value={formData.cozinha}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salas</label>
              <input
                type="number"
                name="sala"
                value={formData.sala}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vagas de Garagem</label>
              <input
                type="number"
                name="garagem"
                value={formData.garagem}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Suítes</label>
              <input
                type="number"
                name="suite"
                value={formData.suite}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Áreas de Serviço</label>
              <input
                type="number"
                name="areaServico"
                value={formData.areaServico}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
                min="0"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar Imóvel'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
