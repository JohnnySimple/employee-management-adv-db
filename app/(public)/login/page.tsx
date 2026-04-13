"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import axios from "axios";

const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." })
});

type FormData = z.infer<typeof formSchema>;
    
export default function Loginpage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);

    // const [email, setEmail] = useState("")
    // const [password, setPassword] = useState("")

    

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema)
    });

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        try {
            const res = await axios.post("/api/auth/login", data)
            const { role } = res.data.user

            if (role === "ADMIN") {
                setIsLoading(false);
                router.push("/admin")
            } else if (role === "EMPLOYEE") {
                setIsLoading(false);    
                router.push("/employee")
            } else {
                router.push("/")
            }
        } catch (error: any) {
            setIsLoading(false);
            // console.error(error)
            alert(error.response?.data?.error || "Login failed")
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-[400px]">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                <img 
                    src="/UI_Construction_Logo.png" 
                    alt="Logo" 
                    className="h-48 w-auto object-contain" 
                />
                </div>
                    <CardTitle>Welcome</CardTitle>
                    <CardDescription>Login to your account</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{ errors.email.message }</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                {...register("password")}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{ errors.password.message }</p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="mt-8">
                    { isLoading ? (
                        <Button type="submit" className="w-full text-muted-foreground" disabled>
                           Logging in.....
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    )
                    }
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}