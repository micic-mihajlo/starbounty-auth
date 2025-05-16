/*
  Warnings:

  - Added the required column `githubLink` to the `Bounty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issueNumber` to the `Bounty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `keywords` to the `Bounty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repository` to the `Bounty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requirements` to the `Bounty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bounty" ADD COLUMN     "githubLink" TEXT NOT NULL,
ADD COLUMN     "issueNumber" INTEGER NOT NULL,
ADD COLUMN     "keywords" JSONB NOT NULL,
ADD COLUMN     "repository" TEXT NOT NULL,
ADD COLUMN     "requirements" JSONB NOT NULL;
