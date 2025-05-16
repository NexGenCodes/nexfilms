/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Episode` table. All the data in the column will be lost.
  - You are about to drop the column `episodeNumber` on the `Episode` table. All the data in the column will be lost.
  - You are about to drop the column `releaseDate` on the `Episode` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailUrl` on the `Episode` table. All the data in the column will be lost.
  - You are about to drop the column `backdropUrl` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `genres` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `isAnimation` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `posterUrl` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `releaseDate` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Season` table. All the data in the column will be lost.
  - You are about to drop the column `movieId` on the `Season` table. All the data in the column will be lost.
  - You are about to drop the column `overview` on the `Season` table. All the data in the column will be lost.
  - You are about to drop the column `releaseDate` on the `Season` table. All the data in the column will be lost.
  - You are about to drop the column `seasonNumber` on the `Season` table. All the data in the column will be lost.
  - Added the required column `number` to the `Episode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `posterUrl` to the `Episode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Season` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seriesId` to the `Season` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PgRating" AS ENUM ('G', 'PG', 'PG_13', 'R', 'NC_17', 'TV_Y', 'TV_Y7', 'TV_G', 'TV_PG', 'TV_14', 'TV_MA');

-- DropForeignKey
ALTER TABLE "Season" DROP CONSTRAINT "Season_movieId_fkey";

-- DropIndex
DROP INDEX "Episode_seasonId_episodeNumber_idx";

-- DropIndex
DROP INDEX "Movie_title_type_releaseDate_idx";

-- DropIndex
DROP INDEX "Season_movieId_seasonNumber_idx";

-- AlterTable
ALTER TABLE "Episode" DROP COLUMN "deletedAt",
DROP COLUMN "episodeNumber",
DROP COLUMN "releaseDate",
DROP COLUMN "thumbnailUrl",
ADD COLUMN     "number" SMALLINT NOT NULL,
ADD COLUMN     "posterUrl" VARCHAR(2048) NOT NULL,
ALTER COLUMN "trailerUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "backdropUrl",
DROP COLUMN "deletedAt",
DROP COLUMN "description",
DROP COLUMN "duration",
DROP COLUMN "genres",
DROP COLUMN "isAnimation",
DROP COLUMN "posterUrl",
DROP COLUMN "releaseDate",
DROP COLUMN "title",
DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Season" DROP COLUMN "deletedAt",
DROP COLUMN "movieId",
DROP COLUMN "overview",
DROP COLUMN "releaseDate",
DROP COLUMN "seasonNumber",
ADD COLUMN     "number" SMALLINT NOT NULL,
ADD COLUMN     "seriesId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "UserRole";

-- DropEnum
DROP TYPE "WatchlistStatus";

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "director" TEXT NOT NULL,
    "duration" SMALLINT NOT NULL,
    "pgRating" "PgRating" NOT NULL,
    "posterUrl" TEXT NOT NULL,
    "type" "ContentType" NOT NULL,
    "isAnimation" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "backdropUrl" VARCHAR(2048) NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Series" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenreContent" (
    "contentId" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "GenreContent_pkey" PRIMARY KEY ("contentId","genreId")
);

-- CreateTable
CREATE TABLE "Cast" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ContentCast" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ContentCast_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_slug_key" ON "Genre"("slug");

-- CreateIndex
CREATE INDEX "_ContentCast_B_index" ON "_ContentCast"("B");

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_id_fkey" FOREIGN KEY ("id") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Series" ADD CONSTRAINT "Series_id_fkey" FOREIGN KEY ("id") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Season" ADD CONSTRAINT "Season_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenreContent" ADD CONSTRAINT "GenreContent_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenreContent" ADD CONSTRAINT "GenreContent_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentCast" ADD CONSTRAINT "_ContentCast_A_fkey" FOREIGN KEY ("A") REFERENCES "Cast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContentCast" ADD CONSTRAINT "_ContentCast_B_fkey" FOREIGN KEY ("B") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
