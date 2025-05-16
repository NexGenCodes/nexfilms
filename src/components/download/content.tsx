"use client";
import { motion } from "framer-motion";
import BackHandler from "../backHandler";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { VideoQuality } from "@prisma/client";

interface Props {
  content: {
    title: string;
    videoQualities: VideoQuality[];
  };
}

export default function DownloadContent({ content }: Props) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <BackHandler />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-green-500">
              Download {content.title}
            </CardTitle>
            <CardDescription>
              Choose your preferred download option
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.videoQualities.map((videoQuality, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border border-border rounded-lg p-4 flex justify-between items-center hover:border-green-500/30 hover:bg-green-500/5 transition-colors"
              >
                <div>
                  <h3 className="font-medium">
                    {videoQuality.quality.split("Q")[1]}
                  </h3>
                  {/* <p className="text-sm text-muted-foreground">
                    File size: 2.1 GB
                  </p> */}
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </motion.div>
            ))}
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            {/* <p className="text-sm text-muted-foreground mb-2">
              <FileDown className="inline h-4 w-4 mr-1" /> All downloads are
              secured and encrypted
            </p> */}
            <p className="text-xs text-muted-foreground">
              By downloading, you agree to our terms and conditions. For
              personal use only.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
