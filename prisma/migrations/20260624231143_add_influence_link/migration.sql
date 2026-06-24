-- CreateTable
CREATE TABLE "InfluenceLink" (
    "id" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InfluenceLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InfluenceLink_fromId_idx" ON "InfluenceLink"("fromId");

-- CreateIndex
CREATE INDEX "InfluenceLink_toId_idx" ON "InfluenceLink"("toId");

-- CreateIndex
CREATE UNIQUE INDEX "InfluenceLink_fromId_toId_key" ON "InfluenceLink"("fromId", "toId");

-- AddForeignKey
ALTER TABLE "InfluenceLink" ADD CONSTRAINT "InfluenceLink_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InfluenceLink" ADD CONSTRAINT "InfluenceLink_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;
