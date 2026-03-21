import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);


export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return null;
    }

    try {
        const { payload } = await jwtVerify(token, secret);
        return payload as { userId: string; employeeId: string; role: string };
    } catch (error) {
        console.error("Error verifying JWT:", error);
        return null;
    }
}