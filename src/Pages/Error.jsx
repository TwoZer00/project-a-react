import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Error() {
    const error = useRouteErrors();
    const location = useLocation();
    const navigate = useNavigate();
    console.error(error);
    return (
        <div>Error {error.message}
            <button onClick={() => navigate(-1)}>Go Back</button>
            <button onClick={() => navigate("/")}>Go home</button>
        </div>
    )
}
