import { getMovieById, getSimilarMovies } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Download, Star } from "lucide-react";
import Image from "next/image";
import BackHandler from "@/components/backHandler";
import { Button } from "@/components/ui/button";

type Params = Promise<{ id: string } | undefined>;

export default async function MoviePage(props: { params: Params }) {
  const params = await props.params;
  if (!params?.id) {
    notFound();
  }
  const movie = await getMovieById(params?.id);
  const genreNames = movie.genres.map((gc) => gc.genre.name);
  const similarMovies = await getSimilarMovies(
    movie.type,
    genreNames,
    movie.movie?.rating ?? 0
  );

  similarMovies.filter((movie) => movie.id !== params?.id);

  if (!movie && !similarMovies) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackHandler />

      <div
        className="grid gap-6 sm:grid-cols-2 md:grid-cols-[1fr_1fr] 
      lg:gap-12 lg:grid-cols-[400px_1fr] "
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
        </div>
         <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-green-500">
            {movie.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge
              variant="outline"
              className="bg-green-500/10 text-green-500 border-green-500/20"
            >
              {movie.pgRating}
            </Badge>

            <div className="flex items-center text-yellow-500">
              <Star className="h-4 w-4 fill-yellow-500 mr-1" />
              <span>{movie.movie?.rating.toFixed(1)}/10</span>
            </div>

            <div className="flex items-center text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>{movie.duration}</span>
            </div>

            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                {movie.releaseDate.toLocaleDateString("en-US", {
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
            {movie.description}
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            <Button variant="outline" asChild>
              <Link href={`/download/${movie.id}?type=MOVIES`}>
                <Download className="mr-2 h-4 w-4" /> Download
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1 text-green-500">Director</h3>
              <p>{movie.director}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-1 text-green-500">Cast</h3>
              <p>{movie.cast.map((cast) => cast.name).join(", ")}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="my-12">
        <h2 className="text-2xl font-bold mb-4">You might also like</h2>
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(170px,1fr))] ">
          {similarMovies.map((movie) => (
            <Link
              key={movie.id}
              href={`/${movie.type.toLowerCase()}/${movie.id}`}
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
                <Image
                  src={movie.posterUrl}
                  alt={`Similar movie ${movie.title}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
