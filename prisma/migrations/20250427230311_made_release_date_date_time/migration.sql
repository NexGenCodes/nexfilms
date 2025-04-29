/*
  Warnings:

  - Changed the type of `releaseDate` on the `Episode` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `releaseDate` on the `Movie` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `releaseDate` on the `Season` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Episode" DROP COLUMN "releaseDate",
ADD COLUMN     "releaseDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "releaseDate",
ADD COLUMN     "releaseDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Season" DROP COLUMN "releaseDate",
ADD COLUMN     "releaseDate" TIMESTAMP(3) NOT NULL;
