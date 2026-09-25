-- CreateTable
CREATE TABLE "PatientData" (
    "id" TEXT NOT NULL,
    "phcId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalVisits" INTEGER NOT NULL DEFAULT 0,
    "admissions" INTEGER NOT NULL DEFAULT 0,
    "discharges" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PatientData_pkey" PRIMARY KEY ("id")
);
