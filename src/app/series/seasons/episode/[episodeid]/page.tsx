import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getEpisodeById, getSeasonById, getSeriesById } from "@/lib/mockData";

type Params = Promise<
  { id: string; seasonId: string; episodeId: string } | undefined
>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  if (!params?.id) notFound();
  const series = await getSeriesById(params.id);
  const season = await getSeasonById(params.id, params.seasonId);
  const episode = await getEpisodeById(
    params.id,
    params.seasonId,
    params.episodeId
  );

  if (!series || !season || !episode) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <Button variant="ghost" asChild className="mb-6">
        <Link href={`/series/${params.id}/season/${params.seasonId}`}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to {season.title}
        </Link>
      </Button>

      <div className="grid gap-6 md:grid-cols-[300px_1fr] lg:gap-12">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black md:aspect-[2/3]">
          <Image
            src={episode.thumbnailUrl || "/placeholder.svg"}
            alt={episode.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 300px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <Button
            size="icon"
            className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span className="sr-only">Play</span>
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">
                {episode.episodeNumber}. {episode.title}
              </h1>
              <Badge variant="outline" className="ml-2">
                {episode.duration}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{series.title}</Badge>
              <Badge variant="secondary">{season.title}</Badge>
              <Badge className="bg-green-500">Episode</Badge>
            </div>
            <div className="text-amber-500 text-lg">{series.rating}</div>
          </div>

          <div className="pt-4">
            <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
            <p className="text-muted-foreground">{episode.description}</p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button>
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
              Watch Now
            </Button>
            <Button variant="outline">
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
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">More Episodes</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {season.episodes
            .filter((ep) => ep.id !== episode.id)
            .slice(0, 6)
            .map((ep) => (
              <Link
                key={ep.id}
                href={`/series/${params.id}/season/${params.seasonId}/episode/${ep.id}`}
                className="group"
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-md mb-2">
                  <Image
                    src={ep.thumbnailUrl || "/placeholder.svg"}
                    alt={ep.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-8 w-8 text-white"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm font-medium line-clamp-1">
                  {ep.episodeNumber}. {ep.title}
                </p>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
