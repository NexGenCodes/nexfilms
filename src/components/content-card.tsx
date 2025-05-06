import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Genre } from "@prisma/client";

interface ContentCardProps {
  content: {
    id: string;
    title: string;
    type: string;
    year: string;
    rating: number;
    description: string;
    genres: Genre[];
    posterUrl: string;
  };
}

export function ContentCard({ content }: ContentCardProps) {
  if (!content) return null;
  return (
    <Link href={`/${content.type.toLowerCase()}/${content.id}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg dark:hover:shadow-primary/20 hover:shadow-primary/5 hover:-translate-y-1">
        <div className="relative aspect-[2/3] w-full overflow-hidden">
          <Image
            src={content.posterUrl}
            alt={content.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <Badge
            className={cn(
              "absolute top-2 right-2 text-xs font-medium text-white rounded-full px-2 py-1 hover:none capitalize",
              content.type === "MOVIES" && "bg-green-500",
              content.type === "SERIES" && "bg-blue-500"
            )}
          >
            {content.type}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-1">{content.title}</h3>
          {content.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {content.genres.map((genre) => (
                <Badge
                  key={genre.id}
                  className="dark:bg-neutral-800 text-xs bg-neutral-200 text-muted-foreground"
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          )}
          <p className="flex items-center justify-between mt-2">
            <span className="text-sm text-muted-foreground ">
              {content.year}
            </span>
            <span className="text-amber-500 text-sm">{content.rating}</span>
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
