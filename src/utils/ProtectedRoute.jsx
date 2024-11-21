import { Outlet, Navigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext';
import DashboardBase from '../ui/dashboardUI/DashboardBase';


function ProtectedRoute() {
    let { user } = useAuthContext();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <DashboardBase>
            <Outlet />
        </DashboardBase>
    );
}

export default ProtectedRoute;