import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, details) {
    console.error("Unhandled application error:", error, details);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="not-found-page" role="alert">
          <p className="not-found-page__code">Oops</p>
          <h1>Something went wrong</h1>
          <p>
            The page could not be displayed. Reload to try again.
          </p>
          <button
            type="button"
            onClick={() => globalThis.location.reload()}
          >
            Reload page
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
