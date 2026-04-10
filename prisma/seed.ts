import { PrismaClient, Role } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {

/**
* JOB TITLES
*/

    const constructionIntro = await prisma.jobTitle.create({
        data: {
            titleName: "Construction Worker - Level 1",
            payRate: 30
        }
    })
    const constructionJunior = await prisma.jobTitle.create({
        data: {
            titleName: "Construction Worker - Level 2",
            payRate: 40
        }
    })
    const constructionSenior = await prisma.jobTitle.create({
        data: {
            titleName: "Construction Worker - Level 3",
            payRate: 60
        }
    })

    const constructionManager = await prisma.jobTitle.create({
        data: {
            titleName: "Construction Manager",
            payRate: 80
        }
    })

    const resourceManager = await prisma.jobTitle.create({
        data: {
            titleName: "HR Manager",
            payRate: 75
        }
    })


    const hrTitle = await prisma.jobTitle.create({
        data: {
            titleName: "HR Specialist",
            payRate: 45
        }
    })

/**
* DEPARTMENTS
**/

    const labor = await prisma.department.create({
        data: {
            deptName: "Labor"
        }
    })
    const hr = await prisma.department.create({
        data: {
            deptName: "Human Resources"
        }
    })

/**
 ** LEAVE TYPES
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

const constManager = await prisma.employee.create({
    data: {
        firstName: "Wode",
        lastName: "Maya",
        dob: new Date("1985-01-01"),
        hireDate: new Date("2010-01-01"),
        email: "wode@company.com",
        phone: "555-0100",
        jobStatus: "ACTIVE",
        deptId: labor.deptId,
        jobTitleId: constructionManager.jobTitleId
    }
});

const hrManager = await prisma.employee.create({
    data: {
        firstName: "Sarah",
        lastName: "Smith",
        dob: new Date("1988-05-12"),
        hireDate: new Date("2012-03-15"),
        email: "sarah@company.com",
        phone: "555-0200",
        jobStatus: "ACTIVE",
        deptId: hr.deptId,
        jobTitleId: resourceManager.jobTitleId
    }
});

// 10 employees
const employeesData = [
    { firstName: "Alan", lastName: "Turing", email: "alan@company.com", deptId: labor.deptId, titleId: constructionSenior.jobTitleId },
    { firstName: "John", lastName: "Doe", email: "john@company.com", deptId: labor.deptId, titleId: constructionJunior.jobTitleId },
    { firstName: "Jane", lastName: "Smith", email: "jane@company.com", deptId: labor.deptId, titleId: constructionJunior.jobTitleId },
    { firstName: "Bob", lastName: "Brown", email: "bob@company.com", deptId: labor.deptId, titleId: constructionIntro.jobTitleId },
    { firstName: "Alice", lastName: "White", email: "alice@company.com", deptId: labor.deptId, titleId: constructionIntro.jobTitleId},
    { firstName: "Anita", lastName: "Taylor", email: "anita@company.com", deptId: hr.deptId, titleId: constructionIntro.jobTitleId },
    { firstName: "Mark", lastName: "Davis", email: "mark@company.com", deptId: hr.deptId, titleId: constructionIntro.jobTitleId },
    { firstName: "Lucy", lastName: "Wilson", email: "lucy@company.com", deptId: hr.deptId, titleId: hrTitle.jobTitleId },
    { firstName: "Tom", lastName: "Clark", email: "tom@company.com", deptId: hr.deptId, titleId: hrTitle.jobTitleId },
    { firstName: "Kevin", lastName: "Lee", email: "kevin@company.com", deptId: hr.deptId, titleId: hrTitle.jobTitleId },
];

const createdEmployees = []

for (const emp of employeesData) {
    const newEmp = await prisma.employee.create({
        data: {
            firstName: emp.firstName,
            lastName: emp.lastName,
            dob: new Date("2000-01-01"),
            hireDate: new Date("2022-01-01"),
            email: emp.email,
            phone: "111-1111",
            jobStatus: "ACTIVE",
            deptId: emp.deptId,
            jobTitleId: emp.titleId
        }
    })
    createdEmployees.push(newEmp)

}

/**
 * UPDATE DEPARTMENT MANAGERS
 */

// Set the Construction Manager
await prisma.department.update({
    where: { deptId: labor.deptId },
    data: {
        managerId: constManager.employeeId
    }
})

// Set the HR Manager
await prisma.department.update({
    where: { deptId: hr.deptId },
    data: {
        managerId: hrManager.employeeId
    }
})

/**
 * USERS
 */
    const rawPassword = process.env.TEST_PASSWORD;
    if (!rawPassword) {
        throw new Error("TEST_PASSWORD environment variable is not set.")
    }
    const password = await bcrypt.hash(rawPassword, 10)

    await prisma.user.create({
        data: {
            name: "admin",
            email: "admin@company.com",
            passwordHash: password,
            role: Role.ADMIN
        }
    })

// Create User accounts for the 2 Managers - I set them to employee so we dont have accidental manager mishaps

const managers = [constManager, hrManager]
for (const m of managers) {
    await prisma.user.create({
        data: {
            name: m.firstName.toLowerCase(),
            email: m.email,
            passwordHash: password,
            role: Role.EMPLOYEE,
            employeeId: m.employeeId
        }
    })
}

// Create User accounts for the 10 Employees
for (const e of createdEmployees) {
    await prisma.user.create({
        data: {
            name: e.firstName.toLowerCase(),
            email: e.email,
            passwordHash: password,
            role: Role.EMPLOYEE,
            employeeId: e.employeeId
        }
    })
}

/**
 ** PROJECTS
 */

// Engineering Project 1: Infrastructure
const projectEng1 = await prisma.project.create({
    data: {
        projectName: "Jeremy House Landscaping",
        startDate: new Date("2026-01-15"),
        endDate: new Date("2026-12-31"),
        location: "Jeremy House - Austin"
    }
})

// Engineering Project 2: Innovation
const projectEng2 = await prisma.project.create({
    data: {
        projectName: "Irrigation System Farmlands",
        startDate: new Date("2025-06-01"),
        endDate: new Date("2027-01-01"),
        location: "Rural Farmlands - Texas"
    }
})

// HR Project 1: Culture
const projectHr1 = await prisma.project.create({
    data: {
        projectName: "Employee Wellness Initiative",
        startDate: new Date("2026-01-01"),
        endDate: new Date("2026-12-31"),
        location: "Main Office - Austin"
    }
})

// HR Project 2: Systems
const projectHr2 = await prisma.project.create({
    data: {
        projectName: "Talent Acquisition Overhaul",
        startDate: new Date("2025-06-01"),
        endDate: new Date("2027-06-01"),
        location: "Main Office - Austin"
    }
})

// HR Project 3: Systems -- INACTIVE
const projectHr3 = await prisma.project.create({
    data: {
        projectName: "Company Starting",
        startDate: new Date("2024-06-01"),
        endDate: new Date("2025-12-01"),
        location: "Main Office - Austin",
        status : "INACTIVE"
    }
})

/**
 * PROJECT ASSIGNMENTS
 */

await prisma.projectAssigned.createMany({
    data: [
        // --- Engineering Manager (Both Projects) ---
        { employeeId: constManager.employeeId, projectId: projectEng1.projectId, assignedDate: new Date() },
        { employeeId: constManager.employeeId, projectId: projectEng2.projectId, assignedDate: new Date() },

        // --- Construction Employees (Split Up) ---
        { employeeId: createdEmployees[0].employeeId, projectId: projectEng1.projectId, assignedDate: new Date() }, // Alan
        { employeeId: createdEmployees[0].employeeId, projectId: projectEng2.projectId, assignedDate: new Date() }, // Alan
        { employeeId: createdEmployees[1].employeeId, projectId: projectEng1.projectId, assignedDate: new Date() }, // Grace
        { employeeId: createdEmployees[2].employeeId, projectId: projectEng1.projectId, assignedDate: new Date() }, // Ada
        { employeeId: createdEmployees[3].employeeId, projectId: projectEng2.projectId, assignedDate: new Date() }, // Linus
        { employeeId: createdEmployees[4].employeeId, projectId: projectEng2.projectId, assignedDate: new Date() }, // Margaret
        { employeeId: createdEmployees[5].employeeId, projectId: projectEng1.projectId, assignedDate: new Date() }, // Anita
        { employeeId: createdEmployees[6].employeeId, projectId: projectEng2.projectId, assignedDate: new Date() }, // John

        // --- HR Manager (Both Projects) ---
        { employeeId: hrManager.employeeId, projectId: projectHr1.projectId, assignedDate: new Date() },
        { employeeId: hrManager.employeeId, projectId: projectHr2.projectId, assignedDate: new Date() },

        // --- HR Employees (Split Up) ---

        { employeeId: createdEmployees[7].employeeId, projectId: projectHr2.projectId, assignedDate: new Date() }, // Jane
        { employeeId: createdEmployees[8].employeeId, projectId: projectHr2.projectId, assignedDate: new Date() }, // Robert
        { employeeId: createdEmployees[9].employeeId, projectId: projectHr2.projectId, assignedDate: new Date() }, // Alice
    ]
})

/**
 * ATTENDANCE
 */

//goal is for this to work like a set seed in r so that way rng is same each time 
function seededRandom(seed: number) {
    return function() {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
} 

const attendanceRecords: any[] = [];
const now = new Date();
const rng = seededRandom(42);

const getDateXDaysAgo = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    d.setHours(0, 0, 0, 0); 
    return d;
};

// Create a tracker to count daily hours by month/year
const dailyHoursByMonth = new Map<string, { reg: number, ot: number }>();

// Last 2 weeks
for (let i = 1; i < 43; i++) {
    const workDate = getDateXDaysAgo(i);
    const isWeekend = workDate.getDay() === 0 || workDate.getDay() === 6;

    if (!isWeekend) {
        [constManager, hrManager, ...createdEmployees].forEach((emp) => {
    let dailyVariance = Math.floor(rng() * 11) / 10;
    let hoursWorked = 7.5 + dailyVariance;
    let overtimeHours = (rng() > 0.8) ? 1.5 : 0;

    if (hoursWorked > 8) {
        overtimeHours = Math.round((hoursWorked - 8) * 10) / 10;
        hoursWorked = 8;
    }
    
    const totalHoursForDay = hoursWorked + overtimeHours;

    const datePart = workDate.toISOString().split('T')[0];

    const jitterMinutes = Math.floor(rng() * 30) - 15;
    
    const tempIn = new Date(`${datePart}T05:00:00.000Z`);
    tempIn.setMinutes(tempIn.getMinutes() + jitterMinutes);
    const tempOut = new Date(tempIn.getTime() + (totalHoursForDay * 3600000));

    attendanceRecords.push({
        employeeId: emp.employeeId,
        workDate: new Date(workDate),
        timeIn: tempIn.toISOString(), 
        timeOut: tempOut.toISOString(), 
        hoursWorked: hoursWorked,
        overtimeHours: overtimeHours
    });
});
    }
}

// Bulk for past 12 months
for (let i = 1; i <= 12; i++) {
    const monthDate = new Date();
    monthDate.setMonth(now.getMonth() - i);
    monthDate.setDate(1); 
    
    const monthIndex = monthDate.getMonth();

    [constManager, hrManager, ...createdEmployees].forEach((emp) => {

        const recordsInMonth = attendanceRecords.filter(r => 
            r.employeeId === emp.employeeId && 
            r.workDate.getMonth() === monthIndex &&
            r.workDate.getFullYear() === monthDate.getFullYear()
        ).length;

        const remainingWorkDays = Math.max(0, 21 - recordsInMonth);

        let baseTarget = remainingWorkDays * 8; 
        let otTarget = (remainingWorkDays > 10) ? 5 : 0; 
        
        const monthlyFlux = Math.round(((rng() * 15) - 7)); 

        if (monthIndex >= 5 && monthIndex <= 8) { // Summer
            baseTarget += 15 + monthlyFlux;
            otTarget += 10; 
        } else if (monthIndex === 11 || monthIndex <= 1) { // Winter
            baseTarget -= 10 + monthlyFlux;
        }

        const dateString = monthDate.toISOString().split('T')[0];
        if (baseTarget > 0) {
            attendanceRecords.push({
                employeeId: emp.employeeId,
                workDate: new Date(monthDate),
                timeIn: new Date(`${dateString}T01:00:00`),
                timeOut: new Date(`${dateString}T09:00:00`),
                hoursWorked: Math.floor(baseTarget),
                overtimeHours: Math.floor(otTarget)
            });
        }
    });
}

await prisma.attendance.createMany({
    data: attendanceRecords
});

/**
* EMPLOYEE LEAVE
*/

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

const today: Date = new Date();
const tomorrow: Date = new Date();
tomorrow.setDate(today.getDate() + 1);

// 2. Data Array
const leaveData = [
    { emp: constManager, start: "2026-02-10", end: "2026-02-15", hours: 40, status: "Approved", type: pto.leaveId },
    { emp: createdEmployees[0], start: "2026-01-05", end: "2026-01-10", hours: 40, status: "Approved", type: pto.leaveId },
    { emp: createdEmployees[1], start: "2026-03-12", end: "2026-03-14", hours: 24, status: "Approved", type: pto.leaveId },
    { emp: createdEmployees[4], start: "2026-02-07", end: "2026-02-08", hours: 8, status: "Approved", type: sick.leaveId },
    { emp: hrManager, start: "2026-06-15", end: "2026-06-20", hours: 40, status: "Approved", type: pto.leaveId },
    { emp: createdEmployees[5], start: "2026-05-20", end: "2026-05-25", hours: 40, status: "Approved", type: pto.leaveId },
    { emp: createdEmployees[2], start: "2026-08-10", end: "2026-08-13", hours: 24, status: "Pending", type: pto.leaveId },
    { emp: createdEmployees[6], start: "2026-09-01", end: "2026-09-03", hours: 16, status: "Pending", type: pto.leaveId },
    { emp: createdEmployees[3], start: "2026-04-20", end: "2026-04-25", hours: 40, status: "Rejected", type: pto.leaveId },
    { emp: createdEmployees[8], start: "2026-12-24", end: "2026-12-31", hours: 48, status: "Rejected", type: pto.leaveId },
    { emp: createdEmployees[9], start: formatDate(today), end: formatDate(tomorrow), hours: 16, status: "Approved", type: pto.leaveId },
    { emp: createdEmployees[7], start: "2026-07-01", end: "2026-07-02", hours: 8, status: "Approved", type: sick.leaveId },
];

// 3. Logic Loop
for (const leave of leaveData) {
    const hoursToDeduct = leave.status === "Approved" ? leave.hours : 0;
    const currentLeaveId = leave.type ?? pto.leaveId;

    const empLeave = await prisma.employeeLeave.create({
        data: {
            employeeId: leave.emp.employeeId,
            leaveId: currentLeaveId,
            totalLeaveHours: 80,
            totalRemaining: 80 - hoursToDeduct,
            status: leave.status 
        }
    });

    await prisma.leaveDate.create({
        data: {
            startDate: new Date(leave.start),
            endDate: new Date(leave.end),
            hoursOff: leave.hours,
            employeeLeaveId: empLeave.employeeLeaveId,
            status: leave.status
        }
    });
}

/**
** SALARIES
*/

    /**
** MONTHLY SALARY PROCESSING (Run on the 23rd of each month)
*/

// 1. Map Job Titles to their pay rates for easy lookup
// We use a Map for O(1) performance during the loop
const jobTitleRates = new Map([
    [constructionIntro.jobTitleId, constructionIntro.payRate],
    [constructionJunior.jobTitleId, constructionJunior.payRate],
    [constructionSenior.jobTitleId, constructionSenior.payRate],
    [constructionManager.jobTitleId, constructionManager.payRate],
    [resourceManager.jobTitleId, resourceManager.payRate],
    [hrTitle.jobTitleId, hrTitle.payRate],
]);

const salaryRecords: any[] = [];
const allEmployees = [constManager, hrManager, ...createdEmployees];
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

allEmployees.forEach(emp => {
    // 2. Group the attendanceRecords by Month/Year for THIS employee
    const monthlyBundles: { [key: string]: { reg: number, ot: number } } = {};

 attendanceRecords
    .filter(record => {
        const date = new Date(record.workDate);
        // Match the employee AND exclude the current month/year
        return record.employeeId === emp.employeeId && 
               !(date.getMonth() === currentMonth && date.getFullYear() === currentYear);
    })
    .forEach(record => {
        const date = new Date(record.workDate);
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;

        if (!monthlyBundles[monthYear]) {
            monthlyBundles[monthYear] = { reg: 0, ot: 0 };
        }
        monthlyBundles[monthYear].reg += record.hoursWorked;
        monthlyBundles[monthYear].ot += record.overtimeHours;
    });
    // 3. Calculate pay for each month found
    Object.keys(monthlyBundles).forEach(monthYear => {
        const [year, month] = monthYear.split('-').map(Number);
        const hourlyRate = jobTitleRates.get(emp.jobTitleId) || 0;
        
        const regPay = monthlyBundles[monthYear].reg * hourlyRate;
        const otPay = monthlyBundles[monthYear].ot * (hourlyRate * 1.5);
        const totalMonthlyPay = Math.round((regPay + otPay) * 100) / 100;

        salaryRecords.push({
            employeeId: emp.employeeId,
            // Set salary date to the 23rd of that specific month
            salaryDate: new Date(year, month - 1, 23),
            amount: totalMonthlyPay
        });
    });
});

salaryRecords.sort((a, b) => a.salaryDate.getTime() - b.salaryDate.getTime());

// 4. Bulk Insert into Database
await prisma.salary.createMany({
    data: salaryRecords
});
}


main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });