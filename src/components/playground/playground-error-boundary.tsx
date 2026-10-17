"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { LabButton } from "@/components/ui";

type Props = {
  children: ReactNode;
  /** Optional reset of parent demo state when retrying */
  onReset?: () => void;
};

type State = {
  error: Error | null;
};

export class PlaygroundErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[PlaygroundErrorBoundary]", error, info.componentStack);
  }

  private handleRetry = () => {
    this.props.onReset?.();
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <div
          role="alert"
          className="flex flex-col gap-3 border border-lab-line bg-lab-panel px-4 py-6 text-sm"
        >
          <p className="font-mono text-[10px] tracking-[0.2em] text-lab-accent uppercase">
            Playground error
          </p>
          <p className="text-lab-fg">
            This playground hit an error. You can retry after resetting state.
          </p>
          <p className="font-mono text-xs text-lab-muted break-words">
            {this.state.error.message}
          </p>
          <div>
            <LabButton variant="outline" onClick={this.handleRetry}>
              Retry
            </LabButton>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
