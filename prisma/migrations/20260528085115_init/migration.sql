-- CreateEnum
CREATE TYPE "public"."LineageExportStatus" AS ENUM ('new', 'in_progress', 'completed', 'failed');

-- CreateEnum
CREATE TYPE "public"."LineageDirection" AS ENUM ('in', 'out', 'both');

-- CreateEnum
CREATE TYPE "public"."LineageAssociation" AS ENUM ('column', 'table');

-- CreateTable
CREATE TABLE "public"."lineage_export" (
    "id" SERIAL NOT NULL,
    "status" "public"."LineageExportStatus" NOT NULL DEFAULT 'new',
    "result_code" TEXT,
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "error_code" TEXT,
    "error_message" TEXT,
    "path" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "user_email" TEXT NOT NULL,
    "obj_id" TEXT NOT NULL,
    "association" "public"."LineageAssociation" NOT NULL,
    "is_reference_obj" BOOLEAN NOT NULL,
    "direction" "public"."LineageDirection" NOT NULL,
    "is_horizontal_lineage" BOOLEAN NOT NULL,
    "is_all_columns" BOOLEAN NOT NULL,

    CONSTRAINT "lineage_export_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lineage_export_status_created_at_idx" ON "public"."lineage_export"("status", "created_at");
