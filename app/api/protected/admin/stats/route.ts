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

        return NextResponse.json({
            "employees": {
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
            "projects": projects,
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