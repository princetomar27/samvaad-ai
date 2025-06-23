"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const HomeView = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  if (!session) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <h1>Home Page</h1>
      {session ? (
        <div>
          <p>Welcome, {session.user.name || session.user.email}!</p>
          <Button
            onClick={() =>
              authClient.signOut({
                // To immediately redirect to sign-in page after signing out
                fetchOptions: {
                  onSuccess: () => {
                    router.push("/sign-in");
                  },
                },
              })
            }
          >
            Sign Out
          </Button>
        </div>
      ) : (
        <p>Not authenticated</p>
      )}
    </div>
  );
};

export default HomeView;
