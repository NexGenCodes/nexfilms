import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getMovieById } from "@/lib/mockData";

type Params = Promise<{ id: string } | undefined>;

export default async function MoviePage(props: { params: Params }) {
  const params = await props.params;
  if (!params?.id) {
    notFound();
  }
  const movie = await getMovieById(params?.id);

  if (!movie) {
    notFound();
  }
  if (movie.type !== "movie") {
    notFound();
  }

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
            src={movie.posterUrl || "/placeholder.svg"}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 300px"
            priority
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{movie.title}</h1>
              <Badge variant="outline" className="ml-2">
                {movie.year}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <Badge key={genre} variant="secondary">
                  {genre}
                </Badge>
              ))}
              <Badge className="bg-blue-500">Movie</Badge>
            </div>
            <div className="text-amber-500 text-lg">{movie.rating}</div>
          </div>

          <div className="pt-4">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-muted-foreground">{movie.description}</p>
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
        <h2 className="text-2xl font-bold mb-4">You might also like</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="relative aspect-[2/3] w-full overflow-hidden rounded-lg"
            >
              <Image
                src={`/placeholder.svg?height=450&width=300&text=Similar ${
                  i + 1
                }`}
                alt={`Similar movie ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
