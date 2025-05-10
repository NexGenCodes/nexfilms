import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getEpisodeById, getSeasonById, getSeriesById } from "@/lib/db";
import BackHandler from "@/components/backHandler";
import { StarIcon } from "lucide-react";
import DownloadHandler from "@/components/download/handler";

type Params = Promise<{ id: string } | undefined>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  if (!params?.id) notFound();
  const episode = await getEpisodeById(params.id);
  const season = await getSeasonById(episode.seasonId);
  const series = await getSeriesById(season.movieId);

  if (!episode || !season || !series) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <BackHandler />

      <div
        className="grid gap-6 sm:grid-cols-2 md:grid-cols-[1fr_1fr] 
      lg:gap-12 lg:grid-cols-[400px_1fr] "
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black md:aspect-[2/3]">
          <Image
            src={episode.thumbnailUrl}
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
                {episode.duration}{" "}
                <span className="text-muted-foreground ml-1">mins</span>
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{series.title}</Badge>
              <Badge variant="secondary">{season.title}</Badge>
              <Badge className="bg-green-500">Episode</Badge>
            </div>
            <div className="text-amber-500 text-lg flex items-center gap-1 justify-center my-4">
              {series.rating}
              <StarIcon className="h-4 w-4 mt-[2px]" />
            </div>
          </div>

          <DownloadHandler movieId={episode.id} type={series.type} />

          <div className="pt-4">
            <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
            <p className="text-muted-foreground">{episode.description}</p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">More Episodes</h2>
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(150px,1fr))] ">
          {season.episodes
            .filter((ep) => ep.id !== episode.id)
            .slice(0, 6)
            .map((ep) => (
              <Link
                key={ep.id}
                href={`/series/season/episode/${ep.id}`}
                className="group"
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-md mb-2">
                  <Image
                    src={ep.thumbnailUrl}
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
