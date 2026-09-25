-- CreateTable
CREATE TABLE "Transfer" (
    "id" TEXT NOT NULL,
    "fromPhcId" TEXT NOT NULL,
    "toPhcId" TEXT NOT NULL,
    "medicineId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "requestedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Transfer_fromPhcId_idx" ON "Transfer"("fromPhcId");

-- CreateIndex
CREATE INDEX "Transfer_toPhcId_idx" ON "Transfer"("toPhcId");

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
