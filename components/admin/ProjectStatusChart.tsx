"use client";

import {motion} from "framer-motion";

export function ProjectStatusChart({data}:{data:{active:number,inactive:number}}){
     const total=data.active +data.inactive;

     const activePercent= (data.active/total)*100;
     const inactivePercent= (data.inactive/total)*100;

     return (
        <div className="space-y-6">
            {/* Active*/}
            <div>
                <div className="flex justify-between text-sm mb-1">
                    <span>Active Projects</span>
                    <span>{data.active}</span>    
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                initial={{width: 0}} 
                animate={{width: `${activePercent}%`}} 
                 transition={{duration: 0.8}} 
                 className="h-full bg-green-500"/>
                </div>
            </div>
            {/* Inactive */}
            <div>
                <div className="flex justify-between text-sm mb-1">
                    <span>Inactive Projects</span>
                    <span>{data.inactive}</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{width: 0}} 
                        animate={{width: `${inactivePercent}%`}} 
                        transition={{duration: 0.8,delay: 0.2}} 
                        className="h-full bg-gray-500"
                    />
                </div>
            </div>
        </div>
     );
}