"use client";
import { prisma } from "@/lib/db";
import { useState,useEffect } from "react";
import axios from "axios";

interface User{
  id:string,
  name:string,
  email:string
}

interface State{
  users:User[];
  form:{
    name:string,
    email:string
  };
  message:string
}

export default function UserPage(){
  // Single state management
  const [state,setState]=useState<State>({
    users:[],
    form:{name:"",email:""},
    message:""
  });

  // fetch users
  useEffect(()=>{
    const fetchUsers=async ()=>{
      try{
        const {data}=await axios.get<User[]>("api/users");
        setState((prev)=>({...prev,users:data}));
      }catch(err){
        setState((prev)=>({...prev,message:"Error Fetching Users"}));
        console.log(err);
      }
    };
    fetchUsers();
  },[]);

  const handleAddUser=async(e:React.FormEvent)=>{
    e.preventDefault();

    try{
      const{data:newUser}=await axios.post<User>("/api/users",{
        name:state.form.name,
        email:state.form.email,
      });
      setState((prev)=>({
        ...prev,
        users:[...prev.users,newUser],
        form:{name:"",email:""},
        message:"User Added Successfully!",
      }));
    }catch(err){
      setState((prev)=>({...prev,message:"Error adding user."}));
      console.log(err)
    }
  };

  const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const {name,value}=e.target;
    setState((prev)=>({
      ...prev,
      form:{...prev.form,[name]:value},
    }));
  };
    return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans p-4">
      <form
        onSubmit={handleAddUser}
        className="flex flex-col items-center gap-2 mb-6"
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={state.form.name}
          onChange={handleChange}
          className="border px-2 py-1 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={state.form.email}
          onChange={handleChange}
          className="border px-2 py-1 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
        >
          Add User
        </button>
        {state.message && <p>{state.message}</p>}
      </form>

      <table className="w-[50%] text-center border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-x">
          {state.users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
