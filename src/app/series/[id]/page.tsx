import { notFound } from "next/navigation";
import { getSeriesById } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import BackHandler from "@/components/backHandler";
import { StarIcon } from "lucide-react";

type Params = Promise<{ id: string } | undefined>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  if (!params?.id) notFound();
  const series = await getSeriesById(params.id, true);
  const genreNames = series.genres.map((gc) => gc.genre.name);
  if (!series) notFound();

  return (
    <div className="container mx-auto py-6">
      <BackHandler />

      <div
        className="grid gap-6 sm:grid-cols-2 md:grid-cols-[1fr_1fr] 
      lg:gap-12 lg:grid-cols-[400px_1fr] "
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
          <Image
            src={series.posterUrl}
            alt={series.title}
            fill
            className="object-cover"
            sizes="(max-width: 500px) 100vw, 300px"
            priority
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-xl font-bold lg:text-2xl xl:text-5xl my-2">
              {series.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {genreNames.map((genre, index) => (
                <Badge key={index} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {series.releaseDate.toLocaleDateString("en-us", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </Badge>
              <p className="text-amber-500 text-xl flex items-center gap-1 mt-3  my-2 justify-center">
                {series.pgRating} <StarIcon className="h-4 w-4" />
              </p>
            </div>
          </div>

          <div className="my-6">
            <h2 className="text-xl font-semibold">Overview</h2>
            <p className="text-muted-foreground my-1">{series.description}</p>
          </div>
        </div>
      </div>
      <div className="my-12">
        <h2 className="text-2xl font-bold mb-4 capitalize">seasons</h2>
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(150px,1fr))] ">
          {series.series?.seasons.map((season) => (
            <Link key={season.id} href={`/series/season/${season.id}`}>
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={season.posterUrl}
                    alt={season.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{season.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {season.episodes.length} Episodes
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
