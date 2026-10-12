import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Headset, Clock3, Flag, CircleCheck } from "lucide-react";
import { PageHeading, Stat, PageLoading, PageError } from "@/components/assistiQ/shared";
import { TicketTable } from "@/components/assistiQ/ticket-table";
import { ticketsQuery } from "@/services/queries";
import { pageHead } from "@/lib/metadata";
export const Route = createFileRoute("/dashboard")({
  head: () =>
    pageHead(
      "Human support dashboard",
      "Review escalated conversations, customer sentiment, priority and resolution status in the AssistIQ human support queue.",
    ),
  loader: ({ context }) => context.queryClient.ensureQueryData(ticketsQuery),
  component: Dashboard,
  pendingComponent: PageLoading,
  errorComponent: PageError,
});
function Dashboard() {
  const { data: tickets } = useSuspenseQuery(ticketsQuery);
  const escalated = tickets.filter((t) => t.escalated);
  return (
    <div className="page-wrap">
      <PageHeading
        eyebrow="THE HUMAN TOUCH"
        title="Support dashboard"
        description="Step in where it matters. Make every handoff count."
        action={
          <span className="flex items-center gap-2 text-xs text-success">
            <span className="online-dot" />
            Support queue
          </span>
        }
      />
      <div className="stats-grid">
        <Stat
          label="Escalated tickets"
          value={String(escalated.filter((t) => t.status !== "Resolved").length)}
          change="Needs attention"
          icon={Headset}
          note="Ready for human support"
        />
        <Stat
          label="Urgent priority"
          value={String(
            escalated.filter((t) => t.priority === "Urgent" && t.status !== "Resolved").length,
          )}
          change="Prioritize"
          icon={Flag}
          note="Time-sensitive issues"
        />
        <Stat
          label="In progress"
          value={String(escalated.filter((t) => t.status === "In progress").length)}
          change="Active"
          icon={Clock3}
          note="Currently being reviewed"
        />
        <Stat
          label="Resolved"
          value={String(escalated.filter((t) => t.status === "Resolved").length)}
          change="Complete"
          icon={CircleCheck}
          note="Successfully handed off and closed"
        />
      </div>
      <TicketTable tickets={escalated} agent />
    </div>
  );
}
