/*
  Warnings:

  - You are about to drop the column `link` on the `WorkItem` table. All the data in the column will be lost.
  - Added the required column `description` to the `WorkItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `WorkItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkItem" DROP COLUMN "link",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "label" TEXT,
    "workItemId" INTEGER NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technology" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Technology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_WorkItemTechnologies" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_WorkItemTechnologies_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_WorkItemTechnologies_B_index" ON "_WorkItemTechnologies"("B");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_workItemId_fkey" FOREIGN KEY ("workItemId") REFERENCES "WorkItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkItemTechnologies" ADD CONSTRAINT "_WorkItemTechnologies_A_fkey" FOREIGN KEY ("A") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkItemTechnologies" ADD CONSTRAINT "_WorkItemTechnologies_B_fkey" FOREIGN KEY ("B") REFERENCES "WorkItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
