-- AlterTable
ALTER TABLE "ExperienceBlock"
ADD COLUMN "color" TEXT NOT NULL DEFAULT '#94a3b8',
ADD COLUMN "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN "experienceHistory" TEXT NOT NULL DEFAULT '',
ADD COLUMN "officialLink" TEXT NOT NULL DEFAULT '',
ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ExperiencePeriod"
ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Technology"
ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "WorkItem"
DROP COLUMN "description",
ADD COLUMN "impact" TEXT NOT NULL DEFAULT '',
ADD COLUMN "overview" TEXT NOT NULL DEFAULT '',
ADD COLUMN "problem" TEXT NOT NULL DEFAULT '',
ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "WorkGalleryImage" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "workItemId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkGalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignatureContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SignatureContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfileContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminSession" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSession_tokenHash_key" ON "AdminSession"("tokenHash");

-- AddForeignKey
ALTER TABLE "WorkGalleryImage"
ADD CONSTRAINT "WorkGalleryImage_workItemId_fkey"
FOREIGN KEY ("workItemId") REFERENCES "WorkItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminSession"
ADD CONSTRAINT "AdminSession_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed singleton content rows
INSERT INTO "SignatureContent" ("id", "title", "subtitle", "updatedAt")
VALUES (
  1,
  'Web developer making future via keyboard',
  'Years of experience in the web industry with a focus on product quality and usability',
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "ProfileContent" ("id", "title", "description", "updatedAt")
VALUES (
  1,
  'Shall we get acquainted?',
  E'Hi!\n I''m Dmitri, a **web developer** from Chisinau. I specialize in **Frontend Engineering** focusing on building **high quality** web experiences through **clean code.**',
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;

-- Backfill sort orders and richer profile metadata
WITH ordered_blocks AS (
  SELECT
    "ExperienceBlock"."id" AS id,
    ROW_NUMBER() OVER (ORDER BY MIN(ep."startDate"), "ExperienceBlock"."createdAt") - 1 AS sort_order
  FROM "ExperienceBlock"
  LEFT JOIN "ExperiencePeriod" ep ON ep."experienceBlockId" = "ExperienceBlock"."id"
  GROUP BY "ExperienceBlock"."id"
)
UPDATE "ExperienceBlock" eb
SET
  "sortOrder" = ob.sort_order,
  "description" = CASE
    WHEN LOWER(eb."companyName") LIKE '%amigo%' THEN 'Amigo Car is a car rental company based in Chisinau, Moldova.'
    WHEN LOWER(eb."companyName") LIKE '%lukoil%' THEN 'Lukoil is a major oil and gas company with global operations.'
    WHEN LOWER(eb."companyName") LIKE '%insomniac%' THEN 'Insomniac Design is a Washington, DC based digital agency specializing in branding, web, and product design.'
    WHEN LOWER(eb."companyName") LIKE '%ev point%' OR LOWER(eb."companyName") LIKE '%evpoint%' THEN 'EV Point is a Moldova-based company providing EV charging networks and automated parking solutions.'
    ELSE eb."description"
  END,
  "officialLink" = CASE
    WHEN LOWER(eb."companyName") LIKE '%amigo%' THEN 'https://www.amigocar.md/'
    WHEN LOWER(eb."companyName") LIKE '%lukoil%' THEN 'https://www.lukoil.md/'
    WHEN LOWER(eb."companyName") LIKE '%insomniac%' THEN 'https://www.insomniacdesign.com/'
    ELSE eb."officialLink"
  END,
  "experienceHistory" = CASE
    WHEN LOWER(eb."companyName") LIKE '%amigo%' THEN 'AmigoCar was my first professional experience in web development, where I built interfaces with HTML, SASS, and JavaScript.'
    WHEN LOWER(eb."companyName") LIKE '%lukoil%' THEN 'At Lukoil, I worked as a product designer on a mobile application and related visual assets.'
    WHEN LOWER(eb."companyName") LIKE '%insomniac%' THEN 'At Insomniac Design, I built full-fledged web applications, admin panels, and technical product solutions that significantly expanded my engineering skills.'
    WHEN LOWER(eb."companyName") LIKE '%ev point%' OR LOWER(eb."companyName") LIKE '%evpoint%' THEN 'At EV Point, I supported internal technical processes and product operations.'
    ELSE eb."experienceHistory"
  END,
  "color" = CASE
    WHEN LOWER(eb."companyName") LIKE '%amigo%' THEN '#009DFF'
    WHEN LOWER(eb."companyName") LIKE '%lukoil%' THEN '#ED1B34'
    WHEN LOWER(eb."companyName") LIKE '%insomniac%' THEN '#F70B6D'
    WHEN LOWER(eb."companyName") LIKE '%ev point%' OR LOWER(eb."companyName") LIKE '%evpoint%' THEN '#082668'
    ELSE eb."color"
  END
FROM ordered_blocks ob
WHERE eb."id" = ob.id;

WITH ordered_periods AS (
  SELECT
    "ExperiencePeriod"."id" AS id,
    ROW_NUMBER() OVER (
      PARTITION BY "experienceBlockId"
      ORDER BY "startDate", "createdAt"
    ) - 1 AS sort_order
  FROM "ExperiencePeriod"
)
UPDATE "ExperiencePeriod" ep
SET "sortOrder" = op.sort_order
FROM ordered_periods op
WHERE ep."id" = op.id;

WITH ordered_technologies AS (
  SELECT
    "Technology"."id" AS id,
    ROW_NUMBER() OVER (ORDER BY "createdAt", "Technology"."id") - 1 AS sort_order
  FROM "Technology"
)
UPDATE "Technology" t
SET "sortOrder" = ot.sort_order
FROM ordered_technologies ot
WHERE t."id" = ot.id;

-- Seed default works if the table is still empty
INSERT INTO "WorkItem" (
  "title",
  "overview",
  "problem",
  "impact",
  "menuId",
  "iconPath",
  "sortOrder",
  "updatedAt"
)
SELECT *
FROM (
  VALUES
    (
      'Signature',
      'I built Signature to be my living autograph on the web, a portfolio where craft, motion, and personality meet.',
      'The challenge was to avoid a generic portfolio and instead create a web experience that feels unmistakably personal while staying usable.',
      'Signature became a canvas for my technical taste and a clear expression of how I think about product quality, interaction, and identity.',
      (SELECT id FROM "Menu" WHERE LOWER(link) = 'works' ORDER BY id LIMIT 1),
      '/svg/Signature.svg',
      0,
      CURRENT_TIMESTAMP
    ),
    (
      'Magic Math',
      'Magic Math is a playful concept project focused on accessible interaction design and polished frontend execution.',
      'The main difficulty was to make the experience feel engaging and clear without overwhelming the user with unnecessary complexity.',
      'The project helped sharpen animation, interaction, and information hierarchy decisions for content-driven interfaces.',
      (SELECT id FROM "Menu" WHERE LOWER(link) = 'works' ORDER BY id LIMIT 1),
      '',
      1,
      CURRENT_TIMESTAMP
    ),
    (
      'Amigo Car',
      'Amigo Car is a real-world project where I translated business needs into a practical and maintainable frontend experience.',
      'The product needed trustworthy presentation, clear booking-oriented communication, and an implementation that could evolve with the business.',
      'It gave me foundational production experience and shaped how I approach real client constraints and shipping quality.',
      (SELECT id FROM "Menu" WHERE LOWER(link) = 'works' ORDER BY id LIMIT 1),
      '/works/AmigoCarImage.png',
      2,
      CURRENT_TIMESTAMP
    )
) seeded ("title", "overview", "problem", "impact", "menuId", "iconPath", "sortOrder", "updatedAt")
WHERE NOT EXISTS (SELECT 1 FROM "WorkItem");

INSERT INTO "WorkGalleryImage" ("imageUrl", "alt", "sortOrder", "workItemId", "updatedAt")
SELECT '/works/AmigoCarImage.png', 'Amigo Car preview', 0, wi."id", CURRENT_TIMESTAMP
FROM "WorkItem" wi
WHERE wi."title" = 'Amigo Car'
  AND NOT EXISTS (
    SELECT 1
    FROM "WorkGalleryImage" wgi
    WHERE wgi."workItemId" = wi."id"
  );
