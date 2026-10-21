"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { LabButton } from "@/components/ui";
import { useLocale } from "@/i18n/locale";

type Labels = {
  error: string;
  body: string;
  retry: string;
};

type InnerProps = {
  children: ReactNode;
  onReset?: () => void;
  labels: Labels;
};

type State = {
  error: Error | null;
};

class PlaygroundErrorBoundaryInner extends Component<InnerProps, State> {
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
      const { labels } = this.props;
      return (
        <div
          role="alert"
          className="flex flex-col gap-3 border border-lab-line bg-lab-panel px-4 py-6 text-sm"
        >
          <p className="font-mono text-[10px] tracking-[0.2em] text-lab-accent uppercase">
            {labels.error}
          </p>
          <p className="text-lab-fg">{labels.body}</p>
          <p className="font-mono text-xs text-lab-muted break-words">
            {this.state.error.message}
          </p>
          <div>
            <LabButton variant="outline" onClick={this.handleRetry}>
              {labels.retry}
            </LabButton>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function PlaygroundErrorBoundary({
  children,
  onReset,
}: {
  children: ReactNode;
  onReset?: () => void;
}) {
  const { common } = useLocale();
  return (
    <PlaygroundErrorBoundaryInner
      onReset={onReset}
      labels={{
        error: common.playgroundError,
        body: common.playgroundErrorBody,
        retry: common.retry,
      }}
    >
      {children}
    </PlaygroundErrorBoundaryInner>
  );
}
