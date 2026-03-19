/*
  Warnings:

  - Added the required column `timeIn` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "timeIn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "timeOut" TIMESTAMP(3),
ALTER COLUMN "hoursWorked" DROP NOT NULL,
ALTER COLUMN "overtimeHours" DROP NOT NULL;
