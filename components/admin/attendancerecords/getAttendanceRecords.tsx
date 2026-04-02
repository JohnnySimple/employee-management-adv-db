import api from "@/lib/api";

export async function getAttendanceRecords(){
    try{
        const response= await api.get("/leave");
        const data=response.data;
        return data;
    }catch(error){
        console.log("Error fetching attendance records:",error);
        return [];
    }
}