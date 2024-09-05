//Custom hook set document.title
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
export function useDocumentTitle(title) {
    const location = useLocation();
    useEffect(() => {
        document.title = title;
    }, [location.pathname]);
}