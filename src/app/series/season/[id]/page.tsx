import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { getSeasonById, getSeriesById } from "@/lib/db";
import BackHandler from "@/components/backHandler";

type Params = Promise<{ id: string } | undefined>;

export default async function SeasonPage(props: { params: Params }) {
  const params = await props.params;
  if (!params?.id) notFound();

  const season = await getSeasonById(params.id);
  const series = await getSeriesById(season.movieId);

  if (!season || !series) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <BackHandler />

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
          <Link key={episode.id} href={`/series/season/episode/${episode.id}`}>
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
              <div className="flex flex-col md:flex-row items-center ">
                <div className="relative aspect-video w-full md:w-64 overflow-hidden">
                  <Image
                    src={episode.thumbnailUrl}
                    alt={episode.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 500px) 100vw, 200px"
                  />
                </div>
                <CardContent className="p-4 flex-1 items-center justify-center">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">
                        {episode.episodeNumber}. {episode.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {episode.duration}{" "}
                        <span className="text-muted-foreground ml-1">min</span>
                      </p>
                    </div>
                   
                  </div>
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
