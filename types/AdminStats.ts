
export interface AdminStats {
    employeesCount: {
        active: number
        inactive: number
        total: number
    }
    departments: {
        deptId: number
        deptName: string
        managerId: number
        employeeCount: number
    }[]
    departmentCount: number
    projects: {
        projectId: number
        projectName: string
        status: "ACTIVE" | "INACTIVE"
        employeeCount: number
    }[]
    projectCount: {
        active: number
        inactive: number
        total: number
    }
    totalAssignments: number
    activeAssignedEmployeeCount: number
    uniqueProjectsWithAssignmentCount: number
    checkedInEmployeeCount: number
}