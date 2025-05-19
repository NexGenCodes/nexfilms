import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getEpisodeById, getSeasonById, getSeriesById } from "@/lib/db";
import BackHandler from "@/components/backHandler";
import { Download } from "lucide-react";

type Params = Promise<{ id: string } | undefined>;

export default async function EpisodePage(props: { params: Params }) {
  const params = await props.params;
  if (!params?.id) notFound();
  const episode = await getEpisodeById(params.id);
  const season = await getSeasonById(episode.seasonId);
  const series = await getSeriesById(season.seriesId, true);

  if (!episode || !season || !series) notFound();

  const currentIndex = season.episodes.findIndex((ep) => ep.id === episode.id);
  const nextEpisodes = season.episodes.slice(
    currentIndex + 1,
    currentIndex + 7
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <BackHandler />
      </div>

      <div>
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="md:w-1/2">
            <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-8 bg-black">
              {episode.trailerUrl ? (
                <iframe
                  src={episode.trailerUrl}
                  title="Episode Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="object-cover w-full h-full rounded-lg"
                  style={{ aspectRatio: "16/9", border: 0 }}
                />
              ) : (
                <Image
                  src={episode.posterUrl || "/placeholder.svg"}
                  alt={episode.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              )}
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 text-green-500">
                {episode.number}. {episode.title}
              </h1>
              <p className="text-muted-foreground">
                {series.title} • {season.title} • {episode.duration}
              </p>
              <div className="prose dark:prose-invert max-w-none my-2">
                <p>{episode.description}</p>
              </div>
              <Button variant="outline" asChild>
                <Link href={`/download/${episode.id}?type=SERIES`}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">More Episodes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {nextEpisodes.map((otherEpisode) => (
              <Link
                key={otherEpisode.id}
                href={`/series/season/episode/${otherEpisode.id}`}
                className="flex flex-col border border-border rounded-lg overflow-hidden hover:border-green-500 hover:shadow-md hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="relative aspect-video">
                  <Image
                    src={otherEpisode.posterUrl || "/placeholder.svg"}
                    alt={otherEpisode.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold line-clamp-1">
                    {otherEpisode.number}. {otherEpisode.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {otherEpisode.duration}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
