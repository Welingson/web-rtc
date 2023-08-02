import { createContext, useState, useContext } from 'react';

// Crie o contexto de autenticação
const AuthContext = createContext();

// Crie o provedor (Provider) para o contexto de autenticação
function AuthProvider({ children }) {
  // Estado que armazena as informações de autenticação ( usuário e token JWT)
  const [authState, setAuthState] = useState(() => {

    const storedUser = localStorage.getItem('user');

    return storedUser ? JSON.parse(storedUser) : null

  });

  // Função para atualizar o estado de autenticação (por exemplo, durante o login)
  function updateAuthState(userData) {
    // Salvar os dados no localStorage ao chamar updateAuthState
    localStorage.setItem('user', JSON.stringify(userData));

    setAuthState(userData);
  }

  // Função para limpar o estado de autenticação (durante o logout)
  function clearAuthState() {
    // Limpar os dados do localStorage ao chamar clearAuthState
    localStorage.removeItem('user');

    setAuthState(null);
  }

  // Fornecer o contexto para os componentes filhos
  return (
    <AuthContext.Provider
      value={{
        authState,
        updateAuthState,
        clearAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

//hook personalizado para consumir o contexto de autenticação
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
