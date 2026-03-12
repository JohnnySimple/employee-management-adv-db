
export interface Department {
    deptId: number
    deptName: string
    managerId: number
}

export interface JobTitle {
    jobTitleId: number
    titleName: string
    payRate: number
}

export interface Employee {
    employeeId: number
    firstName: string
    lastName: string
    dob: string
    hireDate: string
    email: string
    phone: string
    jobStatus: "ACTIVE" | "INACTIVE"
    deptId: number
    jobTitleId: number
    department: Department
    jobTitle: JobTitle
}