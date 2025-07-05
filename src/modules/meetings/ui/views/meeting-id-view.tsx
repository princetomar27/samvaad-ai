"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import React, { useState } from "react";
import { MeetingIdViewHeader } from "../../components/meeting-id-view-header";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "../../hooks/use-confirm";
import { UpdateMeetingDialog } from "../../components/update-meeting-dialog";
import { UpcomingState } from "../../components/upcoming-state";
import { ActiveState } from "../../components/active-state";
import { CancelledState } from "../../components/cancelled-state";
import { ProcessingState } from "../../components/processing-state";

interface MeetingIdViewProps {
  meetingId: string;
}

const MeetingIdView = ({ meetingId }: MeetingIdViewProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({
      id: meetingId,
    })
  );

  const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);

  const removeMeeting = useMutation(
    trpc.meetings.removeMeeting.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({})
        );
        // TODO: invalidate the free tier usage
        router.push("/meetings");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const [RemoveMeetingConfirmationDialog, confirmRemove] = useConfirm(
    "Are you sure you want to remove this meeting?",
    `This action will remove the meeting and all associated data. This action cannot be undone.`
  );

  const handleRemoveMeeting = async () => {
    const ok = await confirmRemove();
    if (!ok) return;

    await removeMeeting.mutateAsync({ id: meetingId });
  };

  const isActiveMeeting = data.status === "ACTIVE";
  const isCompleted = data.status === "COMPLETED";
  const isCancelled = data.status === "CANCELLED";
  const isUpcoming = data.status === "UPCOMING";
  const isProcessing = data.status === "PROCESSING";

  return (
    <>
      <RemoveMeetingConfirmationDialog />
      <UpdateMeetingDialog
        open={updateMeetingDialogOpen}
        onOpenChange={setUpdateMeetingDialogOpen}
        intialMeetingValue={data}
      />
      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <MeetingIdViewHeader
          meetingId={meetingId}
          meetingName={data.name}
          onEdit={() => setUpdateMeetingDialogOpen(true)}
          onRemove={handleRemoveMeeting}
        />
        {isCancelled && <CancelledState />}
        {isCompleted && (
          <div className="bg-white rounded-lg border">
            <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
              <div className="flex flex-col gap-y-2">
                <h3 className="text-lg font-medium">Meeting Completed</h3>
              </div>
            </div>
          </div>
        )}
        {isUpcoming && (
          <UpcomingState
            meetingId={meetingId}
            onCancelMeeting={() => {}}
            isCancelling={false}
          />
        )}
        {isProcessing && <ProcessingState />}
        {isActiveMeeting && <ActiveState meetingId={meetingId} />}
      </div>
    </>
  );
};

export default MeetingIdView;

export const MeetingIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading meeting"
      description="Please wait while we load the meeting"
    />
  );
};

export const MeetingIdViewError = () => {
  return (
    <ErrorState
      title="Error loading meeting"
      description="Please try again later"
    />
  );
};
