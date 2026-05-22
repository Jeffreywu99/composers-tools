import { Suspense, Component, type ReactNode } from "react";
import { useToolRegistry } from "../../stores/toolRegistry";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          className="p-8 m-4 rounded-xl"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-danger)",
          }}
        >
          <h3
            className="text-base font-semibold mb-2"
            style={{ color: "var(--color-danger)" }}
          >
            发生错误
          </h3>
          <pre
            className="text-xs font-mono whitespace-pre-wrap"
            style={{ color: "var(--color-ink)" }}
          >
            {this.state.error.message}
            {"\n\n"}
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export function ToolContainer() {
  const { tools, activeToolId } = useToolRegistry();
  const activeTool = tools.find((t) => t.id === activeToolId);
  const ActiveComponent = activeTool?.component;

  return (
    <main
      className="flex-1 overflow-y-auto"
      style={{
        backgroundColor: "var(--color-paper)",
        padding: "56px 56px 80px 56px",
      }}
    >
      <ErrorBoundary>
        <Suspense
          fallback={
            <div
              className="flex items-center justify-center h-full"
              style={{ color: "var(--color-ink-muted)" }}
            >
              加载中...
            </div>
          }
        >
          {ActiveComponent ? (
            <ActiveComponent />
          ) : (
            <div
              className="flex flex-col items-center justify-center h-full"
              style={{ gap: 24 }}
            >
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 300,
                  color: "var(--color-accent)",
                  opacity: 0.15,
                  lineHeight: 1,
                }}
              >
                &#9835;
              </div>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--color-ink-muted)",
                  opacity: 0.5,
                  letterSpacing: "0.04em",
                }}
              >
                {activeToolId ? "工具加载中..." : "从左侧选择工具开始"}
              </p>
            </div>
          )}
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
