import { useZoom, ZoomMode } from "@embedpdf/plugin-zoom/react";
// import { useInteractionManager, Tool } from "@embedpdf/plugin-interaction-manager/react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, MousePointer2, Hand, PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  activeDocumentId: string;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function Toolbar({ activeDocumentId, onToggleSidebar, isSidebarOpen }: ToolbarProps) {
  const { provides: zoom, state: zoomState } = useZoom(activeDocumentId);
  // const { setTool, currentTool } = useInteractionManager(activeDocumentId);

  return (
    <div className="flex h-12 w-full items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className={cn("h-8 w-8", isSidebarOpen && "bg-muted")}
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => zoom?.zoomOut()}
          className="h-8 w-8"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <div className="min-w-[4rem] text-center text-sm font-medium">
          {zoomState ? Math.round(zoomState.currentZoomLevel * 100) : 0}%
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => zoom?.zoomIn()}
          className="h-8 w-8"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      {/* Tools - disabled for now until types are resolved */}
      {/* <div className="flex items-center gap-1 rounded-md border bg-muted/50 p-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTool(Tool.Pan)}
          className={cn("h-7 w-7", currentTool === Tool.Pan && "bg-background shadow-sm")}
        >
          <Hand className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTool(Tool.Select)}
          className={cn("h-7 w-7", currentTool === Tool.Select && "bg-background shadow-sm")}
        >
          <MousePointer2 className="h-4 w-4" />
        </Button>
      </div> */}
    </div>
  );
}
