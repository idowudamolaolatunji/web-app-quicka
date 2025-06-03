import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext.jsx';
import { DataProvider } from './context/DataContext.jsx';
import { FetchedProvider } from './context/FetchedContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

import App from './App.jsx';
import './index.css';
import 'rsuite/dist/rsuite-no-reset.min.css';
import 'rsuite-color-picker/lib/styles.css'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT;

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={clientId}>
            <AuthProvider>
                <DataProvider>
                    <FetchedProvider>
                        <App />
                    </FetchedProvider>
                </DataProvider>
            </AuthProvider>
        </GoogleOAuthProvider>
    </StrictMode>,
)