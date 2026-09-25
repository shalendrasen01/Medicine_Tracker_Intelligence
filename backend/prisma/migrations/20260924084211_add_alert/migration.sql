-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "phcId" TEXT NOT NULL,
    "medicineId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Alert_phcId_idx" ON "Alert"("phcId");

-- CreateIndex
CREATE INDEX "Alert_medicineId_idx" ON "Alert"("medicineId");
