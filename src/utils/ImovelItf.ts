export interface ImovelItf {
  id: number;
  area: number;
  valor: number;
  endereco: string;
  bairro: string;
  foto: string;
  quarto: number;
  banheiro: number;
  cozinha: number;
  sala: number;
  garagem: number;
  suite: number;
  areaServico: number;
  tipoImovel: string;
  isArquivado: boolean;
  createdAt: Date;
  updatedAt: Date;
  usuarioId: number;
}
