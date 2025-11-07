import { BrowserRouter } from "react-router-dom";
import {QueryClientProvider} from "@tanstack/react-query";
import {Provider} from "react-redux";
import App from "@/App";
import React from 'react';
import ReactDOM from 'react-dom/client';
import {store} from "@/store ";
import {queryClient} from "@/lib/queryClient.ts";
import {Toaster} from "sonner";
import "./index.css";





ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <App />
                    <Toaster />
                </BrowserRouter>
            </QueryClientProvider>
        </Provider>
    </React.StrictMode>
);
