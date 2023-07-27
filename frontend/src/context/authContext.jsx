import { createContext, useState, useContext } from 'react';

// Crie o contexto de autenticação
const AuthContext = createContext();

// Crie o provedor (Provider) para o contexto de autenticação
function AuthProvider({ children }) {
  // Estado que armazena as informações de autenticação ( usuário e token JWT)
  const [authState, setAuthState] = useState(()=>{

    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      token: storedToken ? storedToken : null,
    };

  });

  // Função para atualizar o estado de autenticação (por exemplo, durante o login)
  function updateAuthState(userData, token) {
    // Salvar os dados no localStorage ao chamar updateAuthState
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);

    setAuthState({
      user: userData,
      token: token,
    });
  }

  // Função para limpar o estado de autenticação (durante o logout)
  function clearAuthState() {
    // Limpar os dados do localStorage ao chamar clearAuthState
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    setAuthState({
      user: null,
      token: null,
    });
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
