import { notFound } from "next/navigation";
// import { DownloadOptions } from "@/components/download/download-options";
import { ContentType } from "@prisma/client";
import {
  getEpisodeById,
  getMovieById,
  getSeasonById,
  getSeriesById,
} from "@/lib/db";
import DownloadContent from "@/components/downloadContent";

type Params = Promise<{ id: string } | undefined>;
type SearchParams = Promise<{ type: ContentType } | undefined>;

export default async function DownloadPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  if (!params?.id) notFound();
  if (!searchParams?.type) notFound();

  if (searchParams.type === "MOVIES") {
    const content = await getMovieById(params.id);
    if (!content) notFound();

    return (
      <div className="container mx-auto py-8">
        <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
          <DownloadContent
            content={{
              image: content.posterUrl,
              title: content.title,
              type: content.type,
              year: content.year,
              rating: content.rating,
              description: content.description,
              genres: content.movieGenres.map((item) => ({
                id: item.genre.id,
                name: item.genre.name,
              })),
            }}
          />
          {/* <DownloadOptions content={processedContent} seasons={seasons} /> */}
        </div>
      </div>
    );
  }

  if (searchParams.type === "SERIES") {
    const content = await getEpisodeById(params.id);
    const season = await getSeasonById(content.seasonId);
    const series = await getSeriesById(season.movieId);
    if (!content) notFound();
    return (
      <div className="container mx-auto py-8">
        <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
          <DownloadContent
            content={{
              image: content.thumbnailUrl,
              title: content.title,
              type: series.type,
              year: series.year,
              rating: series.rating,
              description: content.description,
              genres: series.movieGenres.map((item) => ({
                id: item.genre.id,
                name: item.genre.name,
              })),
            }}
          />
          {/* <DownloadOptions content={processedContent} seasons={seasons} /> */}
        </div>
      </div>
    );
  }
}
