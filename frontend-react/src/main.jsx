import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/index.css";
import "./styles/responsive.css";

import App from "./App.jsx";

import { AuthProvider } from "./contexts/AuthContext";
import { BookmarkProvider } from "./contexts/BookmarkContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BookmarkProvider>
        <App />
      </BookmarkProvider>
    </AuthProvider>
  </StrictMode>
);