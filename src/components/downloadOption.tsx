"use client";

import { useState } from "react";
import { Download, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DownloadContent from "@/actions/download";

// Define download quality options
const QUALITY_OPTIONS = [
  {
    id: "4k",
    label: "4K Ultra HD",
    resolution: "3840x2160",
    fileSize: "8-12 GB",
    bitrate: "35-45 Mbps",
    badge: "PREMIUM",
  },
  {
    id: "1080p",
    label: "Full HD",
    resolution: "1920x1080",
    fileSize: "2-4 GB",
    bitrate: "8-12 Mbps",
  },
  {
    id: "720p",
    label: "HD",
    resolution: "1280x720",
    fileSize: "1-2 GB",
    bitrate: "5-8 Mbps",
  },
  {
    id: "480p",
    label: "SD",
    resolution: "854x480",
    fileSize: "700-900 MB",
    bitrate: "2-4 Mbps",
  },
];

interface Props {
  content: {
    id: string;
    title: string;
    type: string;
  };
}

export function DownloadOptions({ content }: Props) {
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});
  const [downloadComplete, setDownloadComplete] = useState<
    Record<string, boolean>
  >({});

  const handleDownload = async (
    qualityId: string,
    itemId: string = content.id,
    itemType = "content"
  ) => {
    const downloadKey = `${itemType}-${itemId}-${qualityId}`;

    setDownloading((prev) => ({ ...prev, [downloadKey]: true }));

    try {
      await DownloadContent(itemId, qualityId);

      // Simulate download completion after a delay
      setTimeout(() => {
        setDownloading((prev) => ({ ...prev, [downloadKey]: false }));
        setDownloadComplete((prev) => ({ ...prev, [downloadKey]: true }));

        // Reset the complete status after 3 seconds
        setTimeout(() => {
          setDownloadComplete((prev) => ({ ...prev, [downloadKey]: false }));
        }, 3000);
      }, 2000);
    } catch (error) {
      console.error("Download failed:", error);
      setDownloading((prev) => ({ ...prev, [downloadKey]: false }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Download Options</CardTitle>
        <CardDescription>
          Select your preferred quality to download
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DownloadQualityOptions
          itemId={content.id}
          itemType="content"
          downloading={downloading}
          downloadComplete={downloadComplete}
          onDownload={handleDownload}
        />
      </CardContent>
    </Card>
  );
}

function DownloadQualityOptions({
  itemId,
  itemType,
  downloading,
  downloadComplete,
  onDownload,
}: {
  itemId: string;
  itemType: string;
  downloading: Record<string, boolean>;
  downloadComplete: Record<string, boolean>;
  onDownload: (qualityId: string, itemId: string, itemType: string) => void;
}) {
  return (
    <div className="space-y-4">
      {QUALITY_OPTIONS.map((quality) => {
        const downloadKey = `${itemType}-${itemId}-${quality.id}`;

        return (
          <div key={quality.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{quality.label}</span>
                {quality.badge && (
                  <Badge variant="default" className="text-xs">
                    {quality.badge}
                  </Badge>
                )}
              </div>
              <Button
                onClick={() => onDownload(quality.id, itemId, itemType)}
                disabled={downloading[downloadKey]}
              >
                {downloading[downloadKey] ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Downloading...
                  </>
                ) : downloadComplete[downloadKey] ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Downloaded
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </>
                )}
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
              <div>
                <span className="font-medium text-foreground">Resolution:</span>{" "}
                {quality.resolution}
              </div>
              <div>
                <span className="font-medium text-foreground">File Size:</span>{" "}
                {quality.fileSize}
              </div>
              <div>
                <span className="font-medium text-foreground">Bitrate:</span>{" "}
                {quality.bitrate}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
