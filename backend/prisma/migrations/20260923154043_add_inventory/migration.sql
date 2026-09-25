-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "phcId" TEXT NOT NULL,
    "medicineId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "minStock" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_phcId_medicineId_key" ON "Inventory"("phcId", "medicineId");

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_phcId_fkey" FOREIGN KEY ("phcId") REFERENCES "PHC"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
