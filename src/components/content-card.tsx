import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Content, PgRating } from "@prisma/client";

const pgRatingColors: Record<PgRating, string> = {
  G: "border-green-500/30 text-green-500 bg-green-500/5",
  PG: "border-yellow-500/30 text-yellow-500 bg-yellow-500/5",
  PG_13: "border-orange-500/30 text-orange-500 bg-orange-500/5",
  R: "border-red-500/30 text-red-500 bg-red-500/5",
  NC_17: "border-pink-600/30 text-pink-600 bg-pink-600/5",
  TV_Y: "border-green-500/30 text-green-500 bg-green-500/5",
  TV_Y7: "border-lime-500/30 text-lime-500 bg-lime-500/5",
  TV_G: "border-green-500/30 text-green-500 bg-green-500/5",
  TV_PG: "border-yellow-500/30 text-yellow-500 bg-yellow-500/5",
  TV_14: "border-orange-500/30 text-orange-500 bg-orange-500/5",
  TV_MA: "border-red-500/30 text-red-500 bg-red-500/5",
};

function formatPgRating(rating: PgRating) {
  return rating.replace("_", "-");
}

interface ContentCardProps {
  content: Content;
}

export function ContentCard({ content }: ContentCardProps) {
  return (
    <Link
      href={`/${content.type.toLowerCase()}/${content.id}`}
      className="group relative block overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 hover:border-green-500/30 hover:-translate-y-1"
    >
      <div className="aspect-[2/3] relative overflow-hidden">
        <Image
          src={content.posterUrl}
          alt={content.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/90 to-black/0 pt-8">
          <h3 className="font-semibold text-white text-lg line-clamp-1">
            {content.title}
          </h3>
          <p className="text-xs text-white/80 line-clamp-2 mt-1">
            {content.description}
          </p>
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {content.releaseDate.toLocaleDateString("en-US", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium">
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                pgRatingColors[content.pgRating] ||
                  "border-gray-400/30 text-gray-400 bg-gray-400/5"
              )}
            >
              {formatPgRating(content.pgRating)}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}
