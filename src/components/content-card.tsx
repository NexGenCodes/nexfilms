import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Content } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  content: Content;
}

export function ContentCard({ content }: ContentCardProps) {
  if (!content) return null;
  return (
    <Link href={`/${content.type}/${content.id}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
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
              content.type === "movie" && "bg-blue-500",
              content.type === "series" && "bg-green-500"
            )}
          >
            {content.type}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-1">{content.title}</h3>
          <p className="text-xs text-muted-foreground">
            {content.genres.join(", ")}
          </p>
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
