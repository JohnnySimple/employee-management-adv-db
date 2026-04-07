import api from "@/lib/api";

export async function getLeaveRecords(){
    try{
        const response= await api.get("/leave");
        const data=response.data;
        return data;
    }catch(error){
        console.log("Error fetching attendance records:",error);
        return [];
    }
}