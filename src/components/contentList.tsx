"use client";

import { Sorting } from "./sorting";
import { ContentCard } from "./content-card";
import { Genre } from "@prisma/client";
import Pagination from "./pagination";

interface Props {
  items: {
    id: string;
    title: string;
    type: string;
    year: string;
    rating: number;
    description: string;
    genres: Genre[];
    posterUrl: string;
  }[];
  totalItems: number;
  name: "movies" | "series" | "animations";
}

export default function ContentList({ items, totalItems, name }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight capitalize">{name}</h1>
        <Sorting />
      </div>
      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] my-4">
        {items.length === 0 ? (
          <p className="text-gray-500 col-span-full">No {name} found.</p>
        ) : (
          items.map((item) => <ContentCard key={item.id} content={item} />)
        )}
      </div>
      <Pagination
        length={totalItems}
        showFirstLast={true}
        maxDisplayed={5}
        className="mt-8"
      />
    </div>
  );
}
