"use client";

import { useEffect, useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getWatchLists } from "@/actions/profile";
import { WatchlistItem } from "../watchlistItem";
import LoadingSpinner from "../spinner";

interface WatchList {
  image: string;
  title: string;
  userId: string;
  movieId: string;
}

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState<WatchList[]>([]);
  const [isPending, startTransition] = useTransition();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;
    startTransition(() => {
      const fetchWatchlist = async () => {
        try {
          const results = await getWatchLists(session.user.id);
          const items = results.map((result) => ({
            image: result.Movie.posterUrl,
            title: result.Movie.title,
            userId: result.userId,
            movieId: result.Movie.id,
          }));
          setWatchlist(items);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchWatchlist();
    });
  }, [session?.user?.id]);

  const isLoading = status === "loading" || isPending;

  return (
    <TabsContent value="watchlist" className="mt-0">
      <Card>
        <CardHeader>
          <CardTitle>My Watchlist</CardTitle>
          <CardDescription>
            Content you&apos;ve saved to watch later
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSpinner className="my-8" />
          ) : watchlist.length === 0 ? (
            <div className="text-center">
              <p>
                Your watchlist is empty. Start adding movies to watch later!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {watchlist.map((item, i) => (
                <WatchlistItem
                  key={i}
                  image={item.image}
                  title={item.title}
                  userId={item.userId}
                  movieId={item.movieId}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
