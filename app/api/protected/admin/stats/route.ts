import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";


export async function GET() {
    try {
        
        // get active and inactive employees
        const activeEmployees = await prisma.employee.count({
            where: {
                jobStatus: "ACTIVE"
            }
        });

        const inactiveEmployees = await prisma.employee.count({
            where: {
                jobStatus: "INACTIVE"
            }
        });

        // get all departments, group by department and count employees in each department
        const departments = await prisma.department.findMany({
            include: {
                _count: {
                    select: {
                        employees: true
                    }
                },
                manager: true
            }
        });

        // get all projects, group by project and count employees in each project
        const projects = await prisma.project.findMany()

        const activeProjectCount = await prisma.project.count({
            where: {
                status: "ACTIVE"
            }
        })

        const inactiveProjectCount = await prisma.project.count({
            where: {
                status: "INACTIVE"
            }
        })

        // total assignments
        const totalAssignments = await prisma.projectAssigned.count();

        // actively assignned employees
        const activilyAssignedEmployees = await prisma.projectAssigned.findMany({
            distinct: ["employeeId"],
            select: {
                employeeId: true
            }
        })
        const activeAssignedEmployeeCount = activilyAssignedEmployees.length;

        const uniqueProjectsWithAssignment = await prisma.projectAssigned.findMany({
            distinct: ["projectId"],
            select: {
                projectId: true
            }
        })
        const uniqueProjectCount = uniqueProjectsWithAssignment.length;

        // assignments per project
        const assignmentsPerProject = await prisma.projectAssigned.groupBy({
            by: ["projectId"],
            _count: {
                projectId: true
            }
        })

        // assignment per employee
        const assignmentsPerEmployee = await prisma.projectAssigned.groupBy({
            by: ["employeeId"],
            _count: {
                employeeId: true
            }
        })

        // assignment over time
        const assignmentsOverTime = await prisma.projectAssigned.groupBy({
            by: ["assignedDate"],
            _count: {
                assignId: true
            }
        })

        // get employees currently checked in (attendance)
        const today = new Date();
        const checkedInEmployeeCount = await prisma.attendance.count({
            where: {
                timeIn: {
                    gte: new Date(today.getFullYear(), today.getMonth(), today.getDate())
                }
            }
        })

        // get all employees both clocked in and clocked out or absent for today
        const employeesClockedInToday = await prisma.employee.findMany({
            include: {
                attendance: {
                    where: {
                        workDate: {
                            gte: new Date(today.setHours(0, 0, 0, 0)),
                        }
                    },
                    orderBy: {
                        timeIn: "desc"
                    },
                    take: 1
                }
            }
        })

        const checkedInEmployees = await prisma.attendance.findMany({
            where: {
                timeIn: {
                    gte: new Date(today.getFullYear(), today.getMonth(), today.getDate())
                }
            },
            orderBy: [
                {
                    timeOut: { sort: "asc", nulls: "first" } // show those who haven't checked out at the top
                },
                {
                    timeIn: "desc" // among those who haven't checked out, show the most recent check-ins first
                }
            ],
            include: {
                employee: true
            }
        })

        // sample transaction to demonstrate how to run multiple queries in a single transaction
        const [clockedInCount, clockedOutCount] = await prisma.$transaction([
            prisma.attendance.count({
                where: {
                    timeIn: { gte: new Date(today.setHours(0, 0, 0, 0)) },
                    timeOut: null
                }
            }),
            prisma.attendance.count({
                where: {
                    timeIn: { gte: new Date(today.setHours(0, 0, 0, 0)) },
                    timeOut: { not: null }
                }
            })
        ])

        return NextResponse.json({
            "employeesCount": {
                "active": activeEmployees,
                "inactive": inactiveEmployees,
                "total": activeEmployees + inactiveEmployees
            },
            "departments": departments.map(dept => ({
                id: dept.deptId,
                name: dept.deptName,
                manager: dept.manager ? `${dept.manager.firstName} ${dept.manager.lastName}` : "No Manager",
                employeeCount: dept._count.employees
            })),
            "departmentCount": departments.length,
            "projects": projects,
            "projectCount": {
                "active": activeProjectCount,
                "inactive": inactiveProjectCount,
                "total": activeProjectCount + inactiveProjectCount
            },
            "totalAssignments": totalAssignments,
            "activeAssignedEmployeeCount": activeAssignedEmployeeCount,
            "uniqueProjectCount": uniqueProjectCount,
            "assignmentsPerProject": assignmentsPerProject.map(ap => ({
                projectId: ap.projectId,
                assignmentCount: ap._count.projectId
            })),
            "assignmentsPerEmployee": assignmentsPerEmployee.map(ae => ({
                employeeId: ae.employeeId,
                assignmentCount: ae._count.employeeId
            })),
            "assignmentsOverTime": assignmentsOverTime.map(at => ({
                assignedDate: at.assignedDate,
                assignmentCount: at._count.assignId
            })),
            "checkedInEmployeeCount": checkedInEmployeeCount,
            "checkedInEmployees": checkedInEmployees.map(emp => ({
                employeeId: emp.employeeId,
                firstName: emp.employee.firstName,
                lastName: emp.employee.lastName,
                timeIn: emp.timeIn,
                timeOut: emp.timeOut
            })),
            "clockedInCount": clockedInCount,
            "clockedOutCount": clockedOutCount,
            "employeesClockedInToday": employeesClockedInToday.map(emp => ({
                employeeId: emp.employeeId,
                firstName: emp.firstName,
                lastName: emp.lastName,
                attendance: emp.attendance.map(att => ({
                    workDate: att.workDate,
                    timeIn: att.timeIn,
                    timeOut: att.timeOut
                }))
            }))
        })

    } catch (error) {
        console.log("Error fetching stats:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}