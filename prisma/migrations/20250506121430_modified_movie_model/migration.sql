/*
  Warnings:

  - You are about to drop the column `year` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MovieGenre` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MovieGenre" DROP CONSTRAINT "MovieGenre_genreId_fkey";

-- DropForeignKey
ALTER TABLE "MovieGenre" DROP CONSTRAINT "MovieGenre_movieId_fkey";

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "year",
ADD COLUMN     "genres" TEXT[],
ALTER COLUMN "isAnimation" SET DEFAULT false;

-- DropTable
DROP TABLE "Genre";

-- DropTable
DROP TABLE "MovieGenre";
