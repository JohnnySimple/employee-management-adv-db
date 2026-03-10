import { PrismaClient, Role } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {

    /**
     * JOB TITLES
     */
    const devTitle = await prisma.jobTitle.create({
        data: {
            titleName: "Software Developer",
            payRate: 50
        }
    })
    const managerTitle = await prisma.jobTitle.create({
        data: {
            titleName: "Engineering Manager",
            payRate: 80
        }
    })
    const hrTitle = await prisma.jobTitle.create({
        data: {
            titleName: "HR Specialist",
            payRate: 40
        }
    })

    /**
     * DEPARTMENTS
     */
    const engineering = await prisma.department.create({
        data: {
            deptName: "Engineering"
        }
    })
    const hr = await prisma.department.create({
        data: {
            deptName: "Human Resources"
        }
    })

    /**
     * LEAVE TYPES
     */
    const pto = await prisma.leave.create({
        data: {
            leaveType: "PTO"
        }
    })
    const sick = await prisma.leave.create({
        data: {
            leaveType: "Sick"
        }
    })

    /**
     * EMPLOYEES
     */
    const manager = await prisma.employee.create({
        data: {
            firstName: "Wode",
            lastName: "Maya",
            dob: new Date("2000-01-01"),
            hireDate: new Date("2010-01-01"),
            email: "wode@company.com",
            phone: "111-1111",
            jobStatus: "ACTIVE",
            deptId: engineering.deptId,
            jobTitleId: managerTitle.jobTitleId
        }
    })
    const employee1 = await prisma.employee.create({
        data: {
            firstName: "Alan",
            lastName: "Turing",
            dob: new Date("2000-01-01"),
            hireDate: new Date("2010-01-01"),
            email: "alan@company.com",
            phone: "111-1111",
            jobStatus: "ACTIVE",
            deptId: engineering.deptId,
            jobTitleId: devTitle.jobTitleId
        }
    })
    const employee2 = await prisma.employee.create({
        data: {
            firstName: "Anita",
            lastName: "Taylor",
            dob: new Date("2000-01-01"),
            hireDate: new Date("2010-01-01"),
            email: "anita@company.com",
            phone: "111-1111",
            jobStatus: "ACTIVE",
            deptId: hr.deptId,
            jobTitleId: hrTitle.jobTitleId
        }
    })

    /**
     * UPDATE DEPARTMENT MANAGER
     */
    await prisma.department.update({
        where: { deptId: engineering.deptId },
        data: {
            managerId: manager.employeeId
        }
    })

    /**
     * USERS
     */
    const password = await bcrypt.hash(process.env.TEST_PASSWORD, 10)

    await prisma.user.create({
        data: {
            name: "admin",
            email: "admin@company.com",
            passwordHash: password,
            role: Role.ADMIN
        }
    })
    await prisma.user.create({
        data: {
            name: "wode",
            email: "wode@company.com",
            passwordHash: password,
            role: Role.MANAGER,
            employeeId: manager.employeeId
        }
    })
    await prisma.user.create({
        data: {
            name: "alan",
            email: "alan@company.com",
            passwordHash: password,
            role: Role.EMPLOYEE,
            employeeId: employee1.employeeId
        }
    })

    /**
     * PROJECTS
     */
    const project = await prisma.project.create({
        data: {
            projectName: "NEOM",
            startDate: new Date("2026-03-09"),
            endDate: new Date("2035-12-31"),
            location: "Saudi Arabia"
        }
    })

    /**
     * PROJECT ASSIGNMENTS
     */
    await prisma.projectAssigned.createMany({
        data: [
            {
                employeeId: manager.employeeId,
                projectId: project.projectId,
                assignedDate: new Date()
            },
            {
                employeeId: employee1.employeeId,
                projectId: project.projectId,
                assignedDate: new Date()
            }
        ]
    })

    /**
     * SALARIES
     */
    await prisma.salary.createMany({
        data: [
            {
                employeeId: manager.employeeId,
                salaryDate: new Date(),
                amount: 120000
            },
            {
                employeeId: employee1.employeeId,
                salaryDate: new Date(),
                amount: 90000
            }
        ]
    })

    /**
     * ATTENDANCE
     */
    await prisma.attendance.createMany({
        data: [
            {
                employeeId: employee1.employeeId,
                workDate: new Date(),
                hoursWorked: 8,
                overtimeHours: 1
            },
            {
                employeeId: employee2.employeeId,
                workDate: new Date(),
                hoursWorked: 7.5,
                overtimeHours: 0
            }
        ]
    })

    /**
     * EMPLOYEE LEAVE
     */
    const empLeave = await prisma.employeeLeave.create({
        data: {
            employeeId: employee1.employeeId,
            leaveId: pto.leaveId,
            totalLeaveHours: 40,
            totalRemaining: 32,
            status: "Approved"
        }
    })

    await prisma.leaveDate.create({
        data: {
            startDate: new Date("2026-03-10"),
            endDate: new Date("2026-03-20"),
            hoursOff: 8,
            employeeLeaveId: empLeave.employeeLeaveId
        }
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })