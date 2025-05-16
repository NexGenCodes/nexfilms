"use client";

import Sorting from "./sorting";
import { ContentCard } from "./content-card";
import Pagination from "./pagination";
import { Content } from "@prisma/client";
import { motion } from "framer-motion";

interface Props {
  items: Content[];
  totalItems: number;
  name: string;
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
          items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="card-fancy"
            >
              <ContentCard content={item} />
            </motion.div>
          ))
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
