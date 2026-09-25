-- CreateTable
CREATE TABLE "Bed" (
    "id" TEXT NOT NULL,
    "phcId" TEXT NOT NULL,
    "totalBeds" INTEGER NOT NULL,
    "occupied" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bed_phcId_key" ON "Bed"("phcId");

-- AddForeignKey
ALTER TABLE "Bed" ADD CONSTRAINT "Bed_phcId_fkey" FOREIGN KEY ("phcId") REFERENCES "PHC"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
