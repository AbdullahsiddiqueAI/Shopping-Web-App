import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './Store/store.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root')).render(
<QueryClientProvider client={queryClient}>
    <Provider store={store}>

    <BrowserRouter>
    <App />
    </BrowserRouter>
    </Provider>
    </QueryClientProvider>
)
