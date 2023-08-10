import { createContext, useState, useContext } from 'react';
import jwt_decode from 'jwt-decode'

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

    return true;
  }

  // Função para limpar o estado de autenticação (durante o logout)
  function clearAuthState() {
    // Limpar os dados do localStorage ao chamar clearAuthState
    localStorage.removeItem('user');

    setAuthState(null);
  }

  function authVerify() {

    const authStateStorage = localStorage.getItem('user');

    if (!authStateStorage) {
      return false;
    }

    const tokenExpirationTime = jwt_decode(authState.token).exp;
    //converter o valor de milissegundos para segundos
    const currentTimeInSeconds = Date.now() / 1000;

    // Compare a data de expiração com o tempo atual (em segundos)
    if (tokenExpirationTime < currentTimeInSeconds) {
      return false;
    }

    return true;
  }

  // Fornecer o contexto para os componentes filhos
  return (
    <AuthContext.Provider
      value={{
        authState,
        updateAuthState,
        clearAuthState,
        authVerify
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
