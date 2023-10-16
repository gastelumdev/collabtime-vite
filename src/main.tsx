import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

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
                {/* <App /> */}
            </ChakraProvider>
        </ConfigProvider>
    </React.StrictMode>
);
