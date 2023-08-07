import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { Home } from '../pages/home'
import { Login } from '../pages/login'
import { useAuth } from '../context/authContext'


function RequireAuth({ children }) {
    const {authVerify} = useAuth();
    const location = useLocation();

    if (!authVerify()) {
        return <Navigate to="/login" state={{ from: location }} />
    }

    return children;
}


export function Router() {
    return (
        <Routes>
            <Route path='/'
                element={
                    <RequireAuth>
                        <Home />
                    </RequireAuth>
                }
            />
            <Route path='/login' element={<Login />} />
        </Routes>
    )
}