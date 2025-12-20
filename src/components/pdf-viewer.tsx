"use client";

import { createPluginRegistration } from '@embedpdf/core';
import { EmbedPDF } from '@embedpdf/core/react';
import { usePdfiumEngine } from '@embedpdf/engines/react';
import {
  DocumentContent,
  DocumentManagerPluginPackage,
} from '@embedpdf/plugin-document-manager/react';
import { RenderLayer, RenderPluginPackage } from '@embedpdf/plugin-render/react';
import { Scroller, ScrollPluginPackage } from '@embedpdf/plugin-scroll/react';
import { ZoomMode, ZoomPluginPackage } from '@embedpdf/plugin-zoom/react';
import { InteractionManagerPluginPackage } from '@embedpdf/plugin-interaction-manager/react';
import { ThumbnailPluginPackage, ThumbnailsPane, ThumbImg } from '@embedpdf/plugin-thumbnail/react';
import { Viewport, ViewportPluginPackage } from '@embedpdf/plugin-viewport/react';
import { useEffect, useState } from 'react';
import { Toolbar } from './pdf-toolbar';
import { cn } from '@/lib/utils';
import { useScroll } from '@embedpdf/plugin-scroll/react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

interface PdfViewerProps {
  url: string;
}

export function PdfViewer({ url }: PdfViewerProps) {
  const { engine, isLoading: engineLoading } = usePdfiumEngine();
  const [plugins, setPlugins] = useState<any[]>([]);

  useEffect(() => {
    if (url && engine) {
      setPlugins([
        createPluginRegistration(DocumentManagerPluginPackage, {
          initialDocuments: [{ url }],
        }),
        createPluginRegistration(ViewportPluginPackage),
        createPluginRegistration(ScrollPluginPackage),
        createPluginRegistration(RenderPluginPackage),
        createPluginRegistration(ZoomPluginPackage, {
          defaultZoomLevel: ZoomMode.FitWidth,
        }),
        createPluginRegistration(InteractionManagerPluginPackage),
        createPluginRegistration(ThumbnailPluginPackage),
      ]);
    }
  }, [url, engine]);

  if (engineLoading || !engine || plugins.length === 0) {
    return (
      <div className="flex h-[60dvh] min-h-[720px] w-full items-center justify-center rounded-lg border bg-muted/50">
        <div className="animate-pulse text-sm text-muted-foreground">
          Memuat Dokumen...
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[60dvh] min-h-[720px] w-full overflow-hidden rounded-lg border bg-muted/50">
      <EmbedPDF engine={engine} plugins={plugins}>
        {({ activeDocumentId }) =>
          activeDocumentId && <PdfViewerContent activeDocumentId={activeDocumentId} />
        }
      </EmbedPDF>
    </div>
  );
}

function PdfViewerContent({ activeDocumentId }: { activeDocumentId: string }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setIsDrawerOpen(true);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <Toolbar
        activeDocumentId={activeDocumentId}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={handleToggleSidebar}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div
            className={cn(
              "flex flex-col border-r bg-background transition-all duration-300",
              isSidebarOpen ? "w-64" : "w-0 overflow-hidden"
            )}
            style={{ willChange: "width" }}
          >
            <div className="relative h-full w-full overflow-hidden bg-muted/10 p-4">
              <InternalThumbnailList documentId={activeDocumentId} />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-hidden bg-muted/20">
          <DocumentContent documentId={activeDocumentId}>
            {({ isLoaded }) =>
              isLoaded && (
                <Viewport
                  documentId={activeDocumentId}
                  style={{
                    height: '100%',
                    width: '100%',
                  }}
                >
                  <Scroller
                    documentId={activeDocumentId}
                    renderPage={({ width, height, pageIndex }) => (
                      <div style={{ width, height, marginBottom: '20px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                        <RenderLayer
                          documentId={activeDocumentId}
                          pageIndex={pageIndex}
                        />
                      </div>
                    )}
                  />
                </Viewport>
              )
            }
          </DocumentContent>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="h-[80vh]">
          <DrawerHeader>
            <DrawerTitle>Halaman</DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-hidden p-4">
            <div className="relative h-full w-full overflow-hidden rounded-lg bg-muted/10 p-4">
              <InternalThumbnailList documentId={activeDocumentId} />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function InternalThumbnailList({ documentId }: { documentId: string }) {
  const { provides: scroll } = useScroll(documentId);

  return (
    <ThumbnailsPane documentId={documentId}>
      {(m) => (
        <div
          key={m.pageIndex}
          style={{
            position: 'absolute',
            top: m.top,
            width: '100%',
          }}
          className="flex items-center justify-center p-2 cursor-pointer hover:bg-muted/20"
          onClick={() => scroll?.scrollToPage({ pageNumber: m.pageIndex + 1 })}
        >
          <div className="relative shadow-sm transition-shadow hover:shadow-md">
            <ThumbImg
              documentId={documentId}
              meta={m}
              className='h-[210px]'
            />
            <span className="absolute bottom-1 right-1 rounded bg-black/50 px-1 py-0.5 text-[10px] text-white">
              {m.pageIndex + 1}
            </span>
          </div>
        </div>
      )}
    </ThumbnailsPane>
  );
}
