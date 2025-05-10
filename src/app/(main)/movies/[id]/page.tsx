import { getMovieById, getSimilarMovies } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import BackHandler from "@/components/backHandler";
import DownloadHandler from "@/components/download/handler";

type Params = Promise<{ id: string } | undefined>;

export default async function MoviePage(props: { params: Params }) {
  const params = await props.params;
  if (!params?.id) {
    notFound();
  }
  const movie = await getMovieById(params?.id);
  const similarMovies = await getSimilarMovies(
    movie.type,
    movie.genres,
    movie.rating
  );

  if (!movie && !similarMovies) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
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
            sizes="(max-width: 500px) 100vw, 300px"
            priority
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-xl font-bold lg:text-2xl xl:text-5xl my-2">
              {movie.title}
            </h1>
            <div className="flex flex-wrap gap-2 my-8">
              {movie.genres.map((genre, index) => (
                <Badge key={index} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-3 pb-2 pt-3">
              <Badge variant="outline">
                {movie.releaseDate.toLocaleDateString("en-us", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </Badge>
              <p className="text-amber-500 text-lg flex items-center gap-1 justify-center">
                {movie.rating} <StarIcon className="h-4 w-4 mt-[2px]" />
              </p>
            </div>
          </div>

          <DownloadHandler movieId={movie.id} type={movie.type} />
          <div className="my-6">
            <h2 className="text-xl font-semibold">Overview</h2>
            <p className="text-muted-foreground my-1">{movie.description}</p>
          </div>
        </div>
      </div>

      <div className="my-12">
        <h2 className="text-2xl font-bold mb-4">You might also like</h2>
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(150px,1fr))] ">
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
