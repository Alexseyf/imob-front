# Gerenciamento de Estado com Zustand

Este projeto utiliza o Zustand para gerenciamento de estado global. O Zustand é uma biblioteca de gerenciamento de estado pequena, rápida e escalável com uma API amigável.

## Stores Disponíveis

### useAuthStore

Store responsável por gerenciar o estado de autenticação do usuário.

```typescript
const { 
  isAuthenticated, // boolean - indica se o usuário está autenticado
  setIsAuthenticated, // (value: boolean) => void - define o estado de autenticação
  checkAuth, // () => void - verifica se o usuário está autenticado com base no token
  logout // () => void - realiza o logout do usuário
} = useAuthStore();
```

Exemplos de uso:

```typescript
// Verificar se o usuário está autenticado
const isAuthenticated = useAuthStore(state => state.isAuthenticated);

// Fazer logout
const logout = useAuthStore(state => state.logout);
logout();
```

### useImoveisStore

Store responsável por gerenciar a lista de imóveis e suas operações.

```typescript
const {
  imoveis, // ImovelItf[] - lista de imóveis
  loading, // boolean - indica se está carregando dados
  error, // string | null - mensagem de erro, se houver
  fetchImoveis, // () => Promise<void> - busca a lista de imóveis da API
  setImoveis // (imoveis: ImovelItf[]) => void - define a lista de imóveis
} = useImoveisStore();
```

Exemplos de uso:

```typescript
// Obter a lista de imóveis
const imoveis = useImoveisStore(state => state.imoveis);

// Atualizar a lista de imóveis (como em uma pesquisa)
const setImoveis = useImoveisStore(state => state.setImoveis);
setImoveis(novaListaDeImoveis);

// Recarregar os imóveis da API
const fetchImoveis = useImoveisStore(state => state.fetchImoveis);
await fetchImoveis();
```

## Vantagens do Zustand sobre o Context API

1. **Melhor performance**: O Zustand é otimizado para evitar re-renderizações desnecessárias
2. **API mais simples**: Sintaxe menos verbosa e mais direta
3. **Fácil combinação com outras ferramentas**: Funciona bem com React Query, SWR, etc.
4. **Persistência de dados**: Facilmente implementada com middleware
5. **Acesso global**: Não precisa de provedores envolvendo a aplicação
