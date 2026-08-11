import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/base/index.css";
import "./styles/app.css";
import "./styles/responsive.css";

import App from "./App.jsx";

import ErrorBoundary from "./components/common/ErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { BookmarkProvider } from "./contexts/BookmarkContext";
import { LearningProvider } from "./contexts/LearningContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <BookmarkProvider>
          <LearningProvider>
            <App />
          </LearningProvider>
        </BookmarkProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);
