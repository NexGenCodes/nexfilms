import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeasonById, getSeriesById } from "@/lib/db";
import BackHandler from "@/components/backHandler";
import { Badge } from "@/components/ui/badge";

type Params = Promise<{ id: string } | undefined>;

export default async function SeasonPage(props: { params: Params }) {
  const params = await props.params;
  if (!params?.id) notFound();

  const season = await getSeasonById(params.id);
  const series = await getSeriesById(season.seriesId);
  const genreNames = series.genres.map((gc) => gc.genre.name);

  if (!season || !series) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackHandler />

      <div>
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="md:w-1/4">
            <div className="relative aspect-video md:aspect-[2/3] overflow-hidden rounded-lg border border-border">
              <Image
                src={season.posterUrl}
                alt={season.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </div>
          </div>

          <div className="md:w-3/4">
            <h1 className="text-3xl font-bold mb-2 text-green-500">
              {series.title}: {season.title}
            </h1>
            <p className="text-muted-foreground mb-4">
              {season.episodes.length} Episodes •{" "}
              {series.releaseDate.getFullYear()}
            </p>
            <div className="flex flex-wrap gap-2">
              {genreNames.map((genre, index) => (
                <Badge key={index} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>

            <p className="text-muted-foreground my-2">{series.description}</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Episodes</h2>
          <div className="space-y-4">
            {season.episodes.map((episode) => (
              <div key={episode.id}>
                <Link
                  href={`/series/season/episode/${episode.id}`}
                  className="flex flex-col sm:flex-row border border-border rounded-lg overflow-hidden hover:border-green-500 transition-colors hover:shadow-md"
                >
                  <div className="relative sm:w-48 aspect-video">
                    <Image
                      src={episode.posterUrl || "/placeholder.svg"}
                      alt={episode.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 192px"
                    />
                  </div>
                  <div className="p-4 flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">
                        {episode.number}. {episode.title}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {episode.duration}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {episode.description}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
