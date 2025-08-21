-- CreateTable
CREATE TABLE "ExperienceBlock" (
    "id" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "imgPath" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExperienceBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperiencePeriod" (
    "id" SERIAL NOT NULL,
    "position" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "experienceBlockId" INTEGER NOT NULL,

    CONSTRAINT "ExperiencePeriod_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExperiencePeriod" ADD CONSTRAINT "ExperiencePeriod_experienceBlockId_fkey" FOREIGN KEY ("experienceBlockId") REFERENCES "ExperienceBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
