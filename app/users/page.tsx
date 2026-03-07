import { prisma } from "@/lib/db";


export default async function UserPage() {
    const users = await prisma.user.findMany()
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <table className="w-[50%] text-center border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-x">
          {users.map((user) => (
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
