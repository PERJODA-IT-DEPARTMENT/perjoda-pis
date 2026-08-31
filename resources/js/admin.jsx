import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/admin.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AdminApp from './admin/AdminApp.jsx';

const el = document.getElementById('admin-root');
if (el) {
    createRoot(el).render(
        <React.StrictMode>
            <BrowserRouter basename="/admin">
                <AdminApp />
            </BrowserRouter>
        </React.StrictMode>,
    );
}
