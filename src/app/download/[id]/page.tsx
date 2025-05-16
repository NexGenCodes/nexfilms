import { notFound } from "next/navigation";
import { ContentType } from "@prisma/client";
import {
  getEpisodeById,
  getMovieById,
  getSeasonById,
  getSeriesById,
} from "@/lib/db";
import DownloadContent from "@/components/download/content";

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
    const videoQualities = content.movie?.videoQualities;
    if (!content) notFound();

    return (
      <DownloadContent
        content={{
          title: content.title,
          videoQualities: videoQualities || [],
        }}
      />
    );
  }

  if (searchParams.type === "SERIES") {
    const content = await getEpisodeById(params.id);
    const season = await getSeasonById(content.seasonId);
    const series = await getSeriesById(season.seriesId);
    if (!content) notFound();
    return (
      <DownloadContent
        content={{
          title: series.title + ": " + season.title + " - " + content.title,
          videoQualities: content.videoQualities,
        }}
      />
    );
  }
}
