"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const HomeView = () => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.hello.queryOptions({ text: "Prince Tomar" }));

  return (
    <div className=" flex flex-col p-4 gap-y-4">
      <h1>{data?.greeting}</h1>
    </div>
  );
};

export default HomeView;
