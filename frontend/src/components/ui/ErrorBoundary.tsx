import { Component, type ErrorInfo, type ReactNode } from "react";

type State = { hasError: boolean };

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Application error boundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-black p-6 text-white">
          <div className="max-w-md rounded-lg border border-white/10 bg-white/[0.06] p-8 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">BudgetWise</p>
            <h1 className="mt-3 text-2xl font-semibold">Something drifted out of orbit.</h1>
            <p className="mt-3 text-zinc-400">Refresh the page. Your financial data remains protected on the server.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
