
import { Navigate, Outlet } from 'react-router-dom'

function PrivateRoute() {
    const token = localStorage.getItem("PerfumzToken")
    return token ? <Outlet /> : <Navigate to='/sign-in' />
}

export default PrivateRoute