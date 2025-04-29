import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSeasonById, getSeriesById } from "@/lib/db";

type Params = Promise<{ id: string; seasonId: string } | undefined>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  if (!params?.id) notFound();
  const series = await getSeriesById(params.id);
  const season = await getSeasonById(params.seasonId);

  if (!series || !season) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <Button variant="ghost" asChild className="mb-6">
        <Link href={`/series/${params.id}`}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to {series.title}
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {series.title}: {season.title}
        </h1>
        <p className="text-muted-foreground">
          {season.episodes.length} Episodes
        </p>
      </div>

      <div className="grid gap-6">
        {season.episodes.map((episode) => (
          <Link
            key={episode.id}
            href={`/series/${params.id}/season/${params.seasonId}/episode/${episode.id}`}
          >
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
              <div className="flex flex-col md:flex-row">
                <div className="relative aspect-video w-full md:w-64 overflow-hidden">
                  <Image
                    src={episode.thumbnailUrl || "/placeholder.svg"}
                    alt={episode.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 256px"
                  />
                </div>
                <CardContent className="p-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">
                        {episode.episodeNumber}. {episode.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {episode.duration}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                      <span className="sr-only">Play</span>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {episode.description}
                  </p>
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
