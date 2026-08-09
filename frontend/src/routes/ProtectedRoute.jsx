import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
    const { loading, isAuthenticated } = useSelector((state) => state.user);
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
            const timer = setTimeout(() => {
                setShowLoader(false);
            }, 3000);
    
            return () => clearTimeout(timer);
        }, []);


    if (loading === false && !showLoader) {
        if (!isAuthenticated) {
            return <Navigate to={`/login`} replace />
        }
        return children;
    }

    return children;
};

export default ProtectedRoute;