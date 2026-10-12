import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessageSquarePlus, Ticket, Clock3, CircleCheck, Headset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeading, Stat, PageLoading, PageError } from "@/components/assistiQ/shared";
import { TicketTable } from "@/components/assistiQ/ticket-table";
import { ticketsQuery } from "@/services/queries";
import { pageHead } from "@/lib/metadata";
export const Route = createFileRoute("/portal")({
  head: () =>
    pageHead(
      "Customer portal",
      "Track customer support tickets, issue priorities, conversation histories and resolutions in AssistIQ.",
    ),
  loader: ({ context }) => context.queryClient.ensureQueryData(ticketsQuery),
  component: Portal,
  pendingComponent: PageLoading,
  errorComponent: PageError,
});
function Portal() {
  const { data: tickets } = useSuspenseQuery(ticketsQuery);
  return (
    <div className="page-wrap">
      <PageHeading
        eyebrow="CUSTOMER SUPPORT"
        title="Customer portal"
        description="Every issue, every update. All in one place."
        action={
          <Button asChild>
            <Link to="/chat">
              <MessageSquarePlus />
              Get support
            </Link>
          </Button>
        }
      />
      <div className="stats-grid">
        <Stat
          label="Total tickets"
          value={String(tickets.length)}
          change="All issues"
          icon={Ticket}
          note="Across your workspace"
        />
        <Stat
          label="Open tickets"
          value={String(tickets.filter((t) => t.status === "Open").length)}
          change="In queue"
          icon={Clock3}
          note="Waiting for a response"
        />
        <Stat
          label="In progress"
          value={String(tickets.filter((t) => t.status === "In progress").length)}
          change="Active"
          icon={Headset}
          note="A specialist is working on it"
        />
        <Stat
          label="Resolved"
          value={String(tickets.filter((t) => t.status === "Resolved").length)}
          change="Complete"
          icon={CircleCheck}
          note="Issues successfully closed"
        />
      </div>
      <TicketTable tickets={tickets} />
    </div>
  );
}
