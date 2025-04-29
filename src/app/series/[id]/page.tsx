import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getSeriesById } from "@/lib/db";

type Params = Promise<{ id: string } | undefined>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  if (!params?.id) notFound();
  const series = await getSeriesById(params.id);

  if (!series) notFound();

  return (
    <div className="container mx-auto py-6">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>

      <div className="grid gap-6 md:grid-cols-[300px_1fr] lg:gap-12">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
          <Image
            src={series.posterUrl || "/placeholder.svg"}
            alt={series.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 300px"
            priority
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{series.title}</h1>
              <Badge variant="outline" className="ml-2">
                {series.year}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {series.genres.split(",").map((genre) => (
                <Badge key={genre} variant="secondary">
                  {genre}
                </Badge>
              ))}
              <Badge className="bg-green-500">Series</Badge>
            </div>
            <div className="text-amber-500 text-lg">{series.rating}</div>
          </div>

          <div className="pt-4">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-muted-foreground">{series.description}</p>
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
        <h2 className="text-2xl font-bold mb-6">Seasons</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {series.seasons.map((season) => (
            <Link
              key={season.id}
              href={`/series/${series.id}/season/${season.id}`}
            >
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1">
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={season.posterUrl || "/placeholder.svg"}
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
