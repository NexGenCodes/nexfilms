import Image from "next/image";
import { Button } from "@/components/ui/button";
import { removeFromWatchList } from "@/actions/profile";

interface Props {
  image: string;
  title: string;
  userId: string;
  movieId: string;
}

export function WatchlistItem({ image, title, userId, movieId }: Props) {
  return (
    <div className="group relative overflow-hidden rounded-lg">
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>
      <div className="absolute bottom-0 w-full p-4">
        <h3 className="font-semibold text-white text-sm">{title}</h3>
        <p className="text-sm text-white/80">Action, Adventure • 2023</p>
      </div>
      <Button
        variant="destructive"
        size="icon"
        onClick={() => removeFromWatchList(userId, movieId)}
        className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
        <span className="sr-only">Remove</span>
      </Button>
    </div>
  );
}
