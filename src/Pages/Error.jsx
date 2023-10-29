import React from 'react';
import { useAsyncError, useLocation, useNavigate } from 'react-router-dom';

export default function Error() {
    const error = useAsyncError();
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <div>Error {error.message}
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
    )
}
