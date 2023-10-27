import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import "./index.css";
import { store } from "./app/store";

import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter(
    createRoutesFromElements(<Route path="/*" element={<App />} />)
);

import { ChakraProvider } from "@chakra-ui/react";
import { ConfigProvider } from "antd";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: "#1a73e8",
                        colorText: "#3E505B",
                    },
                }}
            >
                <ChakraProvider>
                    <RouterProvider router={router} />
                </ChakraProvider>
            </ConfigProvider>
        </Provider>
    </React.StrictMode>
);
