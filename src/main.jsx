import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext.jsx';
import { DataProvider } from './context/DataContext.jsx';
import { FetchedProvider } from './context/FetchedContext.jsx';

import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <DataProvider>
                <FetchedProvider>
                <App />
                </FetchedProvider>
            </DataProvider>
        </AuthProvider>
    </StrictMode>,
)