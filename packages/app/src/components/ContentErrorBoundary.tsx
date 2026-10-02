import { Component, type ErrorInfo, type ReactNode } from "react";
import { ContentErrorState } from "./ContentState";

type ContentErrorBoundaryProps = {
    children: ReactNode;
    resetKey: string;
    onRetry: () => void;
};

type ContentErrorBoundaryState = {
    error: Error | null;
};

export class ContentErrorBoundary extends Component<
    ContentErrorBoundaryProps,
    ContentErrorBoundaryState
> {
    state: ContentErrorBoundaryState = { error: null };

    static getDerivedStateFromError(error: unknown): ContentErrorBoundaryState {
        return { error: error instanceof Error ? error : new Error(String(error)) };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("Erro isolado na ilha de conteúdo", error, info.componentStack);
    }

    componentDidUpdate(previousProps: ContentErrorBoundaryProps) {
        if (previousProps.resetKey !== this.props.resetKey && this.state.error) {
            this.setState({ error: null });
        }
    }

    private retry = () => {
        this.setState({ error: null });
        this.props.onRetry();
    };

    render() {
        if (this.state.error) {
            return <ContentErrorState error={this.state.error} onRetry={this.retry} />;
        }
        return this.props.children;
    }
}
