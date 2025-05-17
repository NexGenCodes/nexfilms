import { notFound } from "next/navigation";
import { getSeriesById } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import BackHandler from "@/components/backHandler";
import { Calendar } from "lucide-react";

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
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-green-500">
            {series.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge
              variant="outline"
              className="bg-green-500/10 text-green-500 border-green-500/20"
            >
              {series.pgRating}
            </Badge>
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                {series.releaseDate.toLocaleDateString("en-US", {
                  year: "2-digit",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {genreNames.map((genre) => (
              <Badge key={genre} variant="secondary" className="rounded-full">
                {genre}
              </Badge>
            ))}
          </div>

          <p className="text-muted-foreground mb-6 text-base leading-relaxed">
            {series.description}
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1 text-green-500">Director</h3>
              <p>{series.director}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mb-8">
            {series.cast.map((ct, i) => (
              <Badge key={i} variant="secondary" className="rounded-full">
                {ct.name}
              </Badge>
            ))}
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
