import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../components/Layout/Loader";

const SellerProtectedRoute = ({ children }) => {

    const { isLoading, isSeller } = useSelector((state) => state.seller)
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoader(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading === false && !showLoader) {
        if (!isSeller) {
            return <Navigate to={`/shop-create`} replace />
        }
        return children;
    }

    return (
        <Loader />
    )
};

export default SellerProtectedRoute;
