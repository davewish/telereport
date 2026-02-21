/*
  Warnings:

  - You are about to drop the column `bloodPressure` on the `Report` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `diastolicBP` to the `Report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `systolicBP` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL;

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "bloodPressure",
ADD COLUMN     "diastolicBP" INTEGER NOT NULL,
ADD COLUMN     "systolicBP" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");
