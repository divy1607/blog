import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import LogoutButton from "../components/LogoutButton";
import { prisma } from "@repo/db"
import DashboardPage from "../components/DashboardPage";

async function fetchComments(id: number) {
  const comments = await prisma.comment.findMany({
    where: { userId: id }
  })
  return comments;
}

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/api/auth/signin");
    return null;
  }

  const id = Number(session.user.id);
  const username = session.user.username;

  const comments = await fetchComments(id);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Welcome, {username || "User"}!
      </h1>

      <div>
        <h2>{session.user.username}&apos;s comments: </h2>
        <ul>
          {comments.length > 0 ? (comments.map((comment) =>
            <li key={comment.id}>
              {comment.content}
            </li>
          )) : (
            <p>no comments done</p>
          )}
        </ul>
      </div>

      <DashboardPage />
      <LogoutButton />
    </div>
  );
}
