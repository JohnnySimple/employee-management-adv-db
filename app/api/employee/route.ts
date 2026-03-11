import { NextResponse } from "next/server";
import {prisma} from "@/lib/db"

// Retrieve Employeee Information
export async function GET(){
    try{
        // Employee Details which includes department and jobtitle
        const employees=await prisma.employee.findMany({
            // where:{jobStatus:'ACTIVE'},
            include:{
                department:true,
                jobTitle:true
            }
        });

        return NextResponse.json({
            employees,
        });
    } catch(error){
        return NextResponse.json(
            {error: "Unable to Retreive Employee Data"},
            {status : 500}
        )
    }
}

// POST
// export async function POST(req:Request){
//    try{
//     const data = await req.json();
//     // Required Fields
//     const requiredFields=["firstName","lastName","dob","hireDate","email","phone","jobStatus","deptId","jobTitleId"];

//     // Validation
//     for(const field of requiredFields){
//         if(!data[field]){
//             return NextResponse.json(
//                 {error:`${field} is required`},
//                 {status:400}
//             );
//         }
//      }

//     //  Convert the DOB and hireDate fields to Date Objects
//     const dob=new Date(data.dob);
//     if(isNaN(dob.getTime())){
//         return NextResponse.json(
//             {error:"Invalid Date of Birth"},
//             {status:400}
//         );
//      }

//      const hireDate=new Date(data.hireDate);
//      if(isNaN(hireDate.getTime())){
//         return NextResponse.json(
//             {error:"Invalid Hire Date"},
//             {status:400}
//         );
//      }

//     //  Default JobStatus not Required but Putting this here commented
//     const jobStatus=data.jobStatus || "ACTIVE";

//     const deptExists= await prisma.department.findUnique({
//         where:{deptId:Number(data.deptId)}
//     });
//     if(!deptExists){
//         return NextResponse.json({error:`Department ID ${data.deptId} does not exist`},{status:400})
//     }

//     const jobTitleExists=await prisma.jobTitle.findUnique({
//         where:{jobTitleId:Number(data.jobTitleId)}
//     });
//     if(!jobTitleExists){
//         return NextResponse.json({error: `Job Title ID ${data.jobTitleId} does not exist`},{status:400});
//     }

//     //  Create Employee
//     const employee= await prisma.employee.create({
//         data:{
//             firstName:data.firstName.trim(),
//             lastName:data.lastName.trim(),
//             dob:dob,
//             hireDate:hireDate,
//             email:data.email.trim(),
//             phone:data.phone,
//             jobStatus:jobStatus,
//             deptId:data.deptId,
//             jobTitleId:data.jobTitleId
//         }
//     });

//     return NextResponse.json(employee,{status:201});
//    } catch(error:any){
//     console.log("POST Employee Error:",error);

//     if (error.code === "P2002" && error.meta?.target?.includes("email")) {
//       return NextResponse.json({ error: "Email already exists" }, { status: 400 });
//     }

//     return NextResponse.json(
//         {error:"Unable to Create Employee"},
//         {status:500}
//     );
//    }
// }
export async function POST(req: Request) {
const text = await req.text();
  console.log("Raw request body:", text);

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    // Required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "dob",
      "hireDate",
      "email",
      "phone",
      "jobStatus",
      "deptId",
      "jobTitleId",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate dates
    const dob = new Date(data.dob);
    if (isNaN(dob.getTime())) {
      return NextResponse.json({ error: "Invalid Date of Birth" }, { status: 400 });
    }

    const hireDate = new Date(data.hireDate);
    if (isNaN(hireDate.getTime())) {
      return NextResponse.json({ error: "Invalid Hire Date" }, { status: 400 });
    }

    // Default jobStatus
    const jobStatus = data.jobStatus || "ACTIVE";

    // Trim string fields
    const firstName = data.firstName.trim();
    const lastName = data.lastName.trim();
    const email = data.email.trim();

    //  Validate foreign keys exist
    const deptExists = await prisma.department.findUnique({
      where: { deptId: Number(data.deptId) },
    });
    if (!deptExists) {
      return NextResponse.json(
        { error: `Department ID ${data.deptId} does not exist` },
        { status: 400 }
      );
    }

    const jobTitleExists = await prisma.jobTitle.findUnique({
      where: { jobTitleId: Number(data.jobTitleId) },
    });
    if (!jobTitleExists) {
      return NextResponse.json(
        { error: `Job Title ID ${data.jobTitleId} does not exist` },
        { status: 400 }
      );
    }

    // Create employee
    const employee = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        dob,
        hireDate,
        email,
        phone: data.phone,
        jobStatus,
        deptId: Number(data.deptId),
        jobTitleId: Number(data.jobTitleId),
      },
    });

    return NextResponse.json(employee, { status: 201 });

  } catch (error: any) {
    console.error("POST Employee Error:", error);

    // Handle unique constraint (e.g., email)
    if (error.code === "P2002" && error.meta?.target?.includes("email")) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Unable to Create Employee", details: error.message },
      { status: 500 }
    );
  }
}