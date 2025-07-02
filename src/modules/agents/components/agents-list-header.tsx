"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { NewAgentDialog } from "./new-agent-dialog";
import { useState } from "react";
import { useAgentFilters } from "../hooks/use-agent-filters";
import { AgentsSearchFilter } from "./agents-search-filter";
import { DEFAULT_PAGE } from "@/constants";

export const AgentsListHeader = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useAgentFilters();

  const isAnyFilterActive = !!filters.search;

  const handleClearFilters = () => {
    setFilters({
      search: "",
      page: DEFAULT_PAGE,
    });
  };

  return (
    <>
      <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-lg">My Agents</h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            New Agent
          </Button>
        </div>
      </div>
      <div className=" flex items-center gap-x-2 p-2 px-8 ">
        <AgentsSearchFilter />
        {isAnyFilterActive && (
          <Button variant="outline" size="sm" onClick={handleClearFilters}>
            <XCircleIcon /> Clear Filters
          </Button>
        )}
      </div>
    </>
  );
};
