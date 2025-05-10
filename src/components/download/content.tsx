import BackHandler from "../backHandler";
import Image from "next/image";
import { Badge } from "../ui/badge";

interface Props {
  content: {
    type: "MOVIES" | "SERIES";
    posterUrl: string;
    title: string;
    releaseDate: Date;
    genres: string[];
    rating: number;
    description: string;
  };
}

export default function DownloadContent({ content }: Props) {
  const getTypeColor = () => {
    switch (content.type) {
      case "MOVIES":
        return "bg-blue-500 text-white";
      case "SERIES":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="space-y-6">
      <BackHandler />
      <div
        className="grid gap-6 sm:grid-cols-2 md:grid-cols-[1fr_1fr] 
      lg:gap-12 lg:grid-cols-[400px_1fr] "
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
          <Image
            src={content.posterUrl}
            alt={content.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 200px"
            priority
          />
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{content.title}</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline">
              {content.releaseDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </Badge>
            <Badge variant="outline" className={getTypeColor()}>
              {content.type}
            </Badge>
            {content.genres.map((genre, index) => (
              <Badge key={index} variant="secondary">
                {genre}
              </Badge>
            ))}
          </div>

          <div className="text-amber-500 text-lg mb-4">{content.rating}</div>

          <p className="text-muted-foreground">{content.description}</p>
        </div>
      </div>
    </div>
  );
}
