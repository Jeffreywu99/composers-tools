import { Sidebar } from "./Sidebar";
import { ToolContainer } from "./ToolContainer";

export function AppShell() {
  return (
    <div className="flex h-full">
      <Sidebar />
      <ToolContainer />
    </div>
  );
}
