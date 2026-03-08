-- CreateTable
CREATE TABLE "Employee" (
    "employeeId" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "hireDate" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "jobStatus" TEXT NOT NULL,
    "deptId" INTEGER NOT NULL,
    "jobTitleId" INTEGER NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("employeeId")
);

-- CreateTable
CREATE TABLE "Department" (
    "deptId" SERIAL NOT NULL,
    "deptName" TEXT NOT NULL,
    "managerId" INTEGER,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("deptId")
);

-- CreateTable
CREATE TABLE "JobTitle" (
    "jobTitleId" SERIAL NOT NULL,
    "titleName" TEXT NOT NULL,
    "payRate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "JobTitle_pkey" PRIMARY KEY ("jobTitleId")
);

-- CreateTable
CREATE TABLE "Salary" (
    "salaryId" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "salaryDate" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Salary_pkey" PRIMARY KEY ("salaryId")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "attendanceId" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "workDate" TIMESTAMP(3) NOT NULL,
    "hoursWorked" DOUBLE PRECISION NOT NULL,
    "overtimeHours" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("attendanceId")
);

-- CreateTable
CREATE TABLE "Project" (
    "projectId" SERIAL NOT NULL,
    "projectName" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("projectId")
);

-- CreateTable
CREATE TABLE "ProjectAssigned" (
    "assignId" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,
    "assignedDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectAssigned_pkey" PRIMARY KEY ("assignId")
);

-- CreateTable
CREATE TABLE "Leave" (
    "leaveId" SERIAL NOT NULL,
    "leaveType" TEXT NOT NULL,

    CONSTRAINT "Leave_pkey" PRIMARY KEY ("leaveId")
);

-- CreateTable
CREATE TABLE "EmployeeLeave" (
    "employeeLeaveId" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "leaveId" INTEGER NOT NULL,
    "totalLeaveHours" DOUBLE PRECISION NOT NULL,
    "totalRemaining" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',

    CONSTRAINT "EmployeeLeave_pkey" PRIMARY KEY ("employeeLeaveId")
);

-- CreateTable
CREATE TABLE "LeaveDate" (
    "leaveDateId" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "hoursOff" DOUBLE PRECISION NOT NULL,
    "employeeLeaveId" INTEGER NOT NULL,

    CONSTRAINT "LeaveDate_pkey" PRIMARY KEY ("leaveDateId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_deptId_fkey" FOREIGN KEY ("deptId") REFERENCES "Department"("deptId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_jobTitleId_fkey" FOREIGN KEY ("jobTitleId") REFERENCES "JobTitle"("jobTitleId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Employee"("employeeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Salary" ADD CONSTRAINT "Salary_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAssigned" ADD CONSTRAINT "ProjectAssigned_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAssigned" ADD CONSTRAINT "ProjectAssigned_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("projectId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeLeave" ADD CONSTRAINT "EmployeeLeave_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("employeeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeLeave" ADD CONSTRAINT "EmployeeLeave_leaveId_fkey" FOREIGN KEY ("leaveId") REFERENCES "Leave"("leaveId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveDate" ADD CONSTRAINT "LeaveDate_employeeLeaveId_fkey" FOREIGN KEY ("employeeLeaveId") REFERENCES "EmployeeLeave"("employeeLeaveId") ON DELETE RESTRICT ON UPDATE CASCADE;
