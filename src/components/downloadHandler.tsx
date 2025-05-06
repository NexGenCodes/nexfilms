"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ContentType } from "@prisma/client";

interface Props {
  movieId: string;
  type:ContentType
}

export default function DownloadHandler({ movieId, type }: Props) {
  const router = useRouter();

  const handleWatchlist = () => {
    console.log("add to watchlist");
  };

  return (
    <div className="flex gap-4 my-12 flex-wrap">
      <Button onClick={() => router.push(`/download/${movieId}?type=${type}`)}>
        <p className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Download
        </p>
      </Button>

      <Button variant="outline" onClick={handleWatchlist}>
        <p className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          Add to Watchlist
        </p>
      </Button>
    </div>
  );
}
