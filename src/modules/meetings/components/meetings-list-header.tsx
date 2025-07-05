"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";
import { DEFAULT_PAGE } from "@/constants";
import { NewMeetingDialog } from "./new-meeting-dialog";

export const MeetingsListHeader = () => {
  const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false);

  return (
    <>
      <NewMeetingDialog
        open={isMeetingDialogOpen}
        onOpenChange={setIsMeetingDialogOpen}
      />
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-lg">My Meetiw ngs</h5>
          <Button
            onClick={() => {
              setIsMeetingDialogOpen(true);
            }}
          >
            <PlusIcon />
            New Meeting
          </Button>
        </div>
      </div>
      <div className=" flex items-center gap-x-2 p-2 px-8 ">
        <Button variant="outline" size="sm">
          <XCircleIcon /> Clear Filters
        </Button>
      </div>
    </>
  );
};
