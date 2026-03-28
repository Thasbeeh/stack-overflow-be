-- CreateTable
CREATE TABLE "welcomeEmailJob" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "welcomeEmailJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "welcomeEmailJob_jobId_key" ON "welcomeEmailJob"("jobId");
