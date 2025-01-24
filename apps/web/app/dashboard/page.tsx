import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import LogoutButton from "./LogoutButton";

// async function fetchUserSpecificData(username: string) {
//   const res = await fetch(`/api/user/data?username=${username}`, {
//     credentials: 'include', 

//     headers: {
//       'Content-Type': 'application/json'
//     }
//   });

//   console.log('Fetch Response:', {
//     status: res.status,
//     ok: res.ok,
//     headers: Object.fromEntries(res.headers.entries())
//   });

//   const responseText = await res.text();
//   console.log('Response Text:', responseText);

//   if (res.ok) {
//     return JSON.parse(responseText);
//   }

//   throw new Error(`API Error: ${res.status} - ${responseText}`);
// }

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // let userData;
  // try {
  //   userData = await fetchUserSpecificData(session.user.username);
  // } catch (error) {
  //   userData = { message: "Error loading user data: ", error };
  // }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {session.user.username || "User"}!
      </h1>

      {/* <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl mb-2">Your Data:</h2>
        <pre className="bg-white p-2 rounded overflow-x-auto">
          {JSON.stringify(userData, null, 2)}
        </pre>
      </div> */}

      <LogoutButton />
    </div>
  );
}