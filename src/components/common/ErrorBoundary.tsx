import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('DRISHTI Subsystem Uncaught Error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#0f1114] text-[#e5e7eb] font-mono text-xs select-none">
          <div className="max-w-md w-full p-6 rounded bg-[#181b1f] border border-[#30353b] space-y-4 text-center">
            <div className="w-10 h-10 rounded-full bg-[#c93c3c]/20 border border-[#c93c3c]/50 flex items-center justify-center mx-auto text-[#c93c3c]">
              <ShieldAlert className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <h2 className="text-sm font-bold tracking-wider text-[#e5e7eb] uppercase">
                {this.props.fallbackTitle || 'SUBSYSTEM ISOLATION ENGAGED'}
              </h2>
              <p className="text-[11px] text-[#8d949d] leading-relaxed">
                An anomaly occurred in this workspace module. The core DRISHTI platform and adjacent sensor channels remain operational.
              </p>
            </div>

            {this.state.error && (
              <div className="p-2.5 rounded bg-[#111315] border border-[#30353b] text-left text-[10px] text-[#c28a28] overflow-x-auto max-h-24">
                <code>{this.state.error.toString()}</code>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="px-4 py-2 rounded bg-[#20242a] hover:bg-[#30353b] border border-[#30353b] text-[#e5e7eb] flex items-center gap-1.5 transition-colors font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#477da8]" />
                <span>RELOAD SUBSYSTEM</span>
              </button>

              <a
                href="/app/command"
                className="px-4 py-2 rounded bg-[#477da8] hover:bg-[#477da8]/90 text-white flex items-center gap-1.5 transition-colors font-semibold"
              >
                <Home className="w-3.5 h-3.5" />
                <span>RETURN TO COMMAND</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
