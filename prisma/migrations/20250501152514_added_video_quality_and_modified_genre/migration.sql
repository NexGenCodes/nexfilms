/*
  Warnings:

  - You are about to drop the column `videoUrl` on the `Episode` table. All the data in the column will be lost.
  - You are about to alter the column `episodeNumber` on the `Episode` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `title` on the `Episode` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `duration` on the `Episode` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `thumbnailUrl` on the `Episode` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2048)`.
  - You are about to alter the column `trailerUrl` on the `Episode` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2048)`.
  - You are about to drop the column `genres` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Movie` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `Movie` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `posterUrl` on the `Movie` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2048)`.
  - You are about to alter the column `backdropUrl` on the `Movie` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2048)`.
  - You are about to alter the column `year` on the `Movie` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(4)`.
  - You are about to alter the column `duration` on the `Movie` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `trailerUrl` on the `Movie` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2048)`.
  - You are about to alter the column `rating` on the `Movie` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Real`.
  - You are about to alter the column `seasonNumber` on the `Season` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `title` on the `Season` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `posterUrl` on the `Season` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2048)`.
  - You are about to alter the column `name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `password` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `image` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2048)`.
  - Added the required column `rating` to the `Episode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Episode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Season` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WatchlistStatus" AS ENUM ('PLANNED', 'WATCHING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "VideoQualityType" AS ENUM ('Q240P', 'Q480P', 'Q720P', 'Q1080P');

-- DropForeignKey
ALTER TABLE "Season" DROP CONSTRAINT "Season_movieId_fkey";

-- DropForeignKey
ALTER TABLE "Watchlist" DROP CONSTRAINT "Watchlist_movieId_fkey";

-- AlterTable
ALTER TABLE "Episode" DROP COLUMN "videoUrl",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "rating" REAL NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "episodeNumber" SET DATA TYPE SMALLINT,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "duration" SET DATA TYPE SMALLINT,
ALTER COLUMN "thumbnailUrl" SET DATA TYPE VARCHAR(2048),
ALTER COLUMN "trailerUrl" SET DATA TYPE VARCHAR(2048);

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "genres",
DROP COLUMN "videoUrl",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "posterUrl" SET DATA TYPE VARCHAR(2048),
ALTER COLUMN "backdropUrl" SET DATA TYPE VARCHAR(2048),
ALTER COLUMN "year" SET DATA TYPE VARCHAR(4),
ALTER COLUMN "duration" SET DATA TYPE SMALLINT,
ALTER COLUMN "trailerUrl" SET DATA TYPE VARCHAR(2048),
ALTER COLUMN "rating" SET DATA TYPE REAL;

-- AlterTable
ALTER TABLE "Season" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "seasonNumber" SET DATA TYPE SMALLINT,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "posterUrl" SET DATA TYPE VARCHAR(2048),
ALTER COLUMN "movieId" SET DATA TYPE VARCHAR;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "image" SET DATA TYPE VARCHAR(2048);

-- AlterTable
ALTER TABLE "Watchlist" ADD COLUMN     "status" "WatchlistStatus" NOT NULL DEFAULT 'PLANNED';

-- CreateTable
CREATE TABLE "Genre" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoQuality" (
    "id" TEXT NOT NULL,
    "episodeId" TEXT,
    "movieId" TEXT,
    "quality" "VideoQualityType" NOT NULL,
    "url" VARCHAR(2048) NOT NULL,

    CONSTRAINT "VideoQuality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieGenre" (
    "movieId" VARCHAR NOT NULL,
    "genreId" VARCHAR NOT NULL,

    CONSTRAINT "MovieGenre_pkey" PRIMARY KEY ("movieId","genreId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- CreateIndex
CREATE INDEX "Genre_name_idx" ON "Genre"("name");

-- CreateIndex
CREATE INDEX "VideoQuality_episodeId_quality_idx" ON "VideoQuality"("episodeId", "quality");

-- CreateIndex
CREATE INDEX "VideoQuality_movieId_quality_idx" ON "VideoQuality"("movieId", "quality");

-- CreateIndex
CREATE UNIQUE INDEX "unique_episode_quality" ON "VideoQuality"("episodeId", "quality");

-- CreateIndex
CREATE UNIQUE INDEX "unique_movie_quality" ON "VideoQuality"("movieId", "quality");

-- CreateIndex
CREATE INDEX "MovieGenre_movieId_idx" ON "MovieGenre"("movieId");

-- CreateIndex
CREATE INDEX "MovieGenre_genreId_idx" ON "MovieGenre"("genreId");

-- CreateIndex
CREATE INDEX "Episode_seasonId_episodeNumber_idx" ON "Episode"("seasonId", "episodeNumber");

-- CreateIndex
CREATE INDEX "Movie_title_type_releaseDate_idx" ON "Movie"("title", "type", "releaseDate");

-- CreateIndex
CREATE INDEX "Season_movieId_seasonNumber_idx" ON "Season"("movieId", "seasonNumber");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Watchlist_userId_status_idx" ON "Watchlist"("userId", "status");

-- AddForeignKey
ALTER TABLE "VideoQuality" ADD CONSTRAINT "VideoQuality_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VideoQuality" ADD CONSTRAINT "VideoQuality_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Watchlist" ADD CONSTRAINT "Watchlist_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieGenre" ADD CONSTRAINT "MovieGenre_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieGenre" ADD CONSTRAINT "MovieGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Season" ADD CONSTRAINT "Season_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
