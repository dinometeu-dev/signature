/*
  Warnings:

  - You are about to drop the column `imgPath` on the `social-link` table. All the data in the column will be lost.
  - You are about to drop the column `img` on the `work-item` table. All the data in the column will be lost.
  - You are about to drop the column `imgPath` on the `work-item-link` table. All the data in the column will be lost.
  - Added the required column `iconPath` to the `social-link` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iconPath` to the `work-item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."SocialLink" DROP COLUMN "imgPath",
ADD COLUMN     "iconPath" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."WorkItem" DROP COLUMN "img",
ADD COLUMN     "iconPath" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."WorkItemLink" DROP COLUMN "imgPath",
ADD COLUMN     "iconPath" TEXT;
