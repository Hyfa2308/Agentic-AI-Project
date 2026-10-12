import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowUpRight,
  MessagesSquare,
  Clock3,
  Smile,
  Headset,
  BrainCircuit,
  HeartHandshake,
  GitBranch,
  ChevronDown,
  Check,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PageHeading,
  Stat,
  SectionTitle,
  ExploreLink,
  PageLoading,
  PageError,
} from "@/components/assistiQ/shared";
import { TicketTable } from "@/components/assistiQ/ticket-table";
import { ticketsQuery } from "@/services/queries";
import { isMockMode } from "@/services/api";
import { pageHead } from "@/lib/metadata";
import headset from "@/assets/support-headset.jpg";
export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "Overview — Customer sentiment and escalation",
      "AssistIQ brings AI-powered customer conversations, sentiment insights and human escalations into one support workspace.",
    ),
  loader: ({ context }) => context.queryClient.ensureQueryData(ticketsQuery),
  component: Overview,
  pendingComponent: PageLoading,
  errorComponent: PageError,
});
function Overview() {
  const { data: tickets } = useSuspenseQuery(ticketsQuery);
  function exportReport() {
    const rows = [
      ["Ticket", "Customer", "Issue", "Status", "Priority", "Sentiment"],
      ...tickets.map((t) => [t.id, t.customer, t.title, t.status, t.priority, t.sentiment]),
    ];
    const csv = rows
      .map((row) => row.map((v) => `"${v.replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "assistiQ-support-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="page-wrap">
      <PageHeading
        eyebrow="YOUR SUPPORT, AT A GLANCE"
        title="Welcome back, Alex 👋"
        description="A little intelligence. A lot more connection."
        action={
          <Button variant="outline" onClick={exportReport} className="text-xs bg-card">
            <Download className="size-3.5" />
            Export report
          </Button>
        }
      />
      <section className="hero-banner">
        <img
          src={headset}
          alt="Mint-green customer support headset"
          width={1024}
          height={1024}
          className="hero-photo"
        />
        <div className="hero-copy">
          <span className="hero-pill">
            <span className="online-dot" />
            INTELLIGENT SUPPORT, HUMAN AT HEART
          </span>
          <h2>
            AssistIQ. Every conversation
            <br className="hidden sm:block" /> deserves to be understood.
          </h2>
          <p>
            Understand customer sentiment, resolve issues with AI, and bring in a human when it
            matters most.
          </p>
          <div className="hero-actions flex items-center gap-5 mt-5">
            <Button asChild className="text-xs">
              <Link to="/chat">
                Start a conversation <ArrowRight className="size-3.5" />
              </Link>
            </Button>
            <Link to="/about" className="flex gap-2 items-center text-xs font-medium text-primary">
              Explore AssistIQ <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </section>
      <div className="flex items-center justify-between mt-6 mb-[-10px]">
        <span className="text-[10px] text-muted-foreground">
          {isMockMode ? "SAMPLE PERFORMANCE · DEMO DATA" : "PERFORMANCE"}
        </span>
        <span className="text-[10px] text-muted-foreground flex items-center gap-2">
          Last 7 days <ChevronDown className="size-3" />
        </span>
      </div>
      <div className="stats-grid">
        <Stat
          label="Total conversations"
          value={isMockMode ? "1,284" : "—"}
          change="12.8%"
          icon={MessagesSquare}
          note="vs. previous 7 days"
        />
        <Stat
          label="AI resolution rate"
          value={isMockMode ? "86.4%" : "—"}
          change="4.2%"
          icon={Check}
          note="Resolved without human handoff"
        />
        <Stat
          label="Avg. response time"
          value={isMockMode ? "1.8s" : "—"}
          change="18.6%"
          icon={Clock3}
          note="Faster than previous 7 days"
        />
        <Stat
          label="Customer satisfaction"
          value={isMockMode ? "94.2%" : "—"}
          change="2.1%"
          icon={Smile}
          note="Based on positive conversations"
        />
      </div>
      <div className="overview-grid">
        <section className="data-panel">
          <SectionTitle
            title="Conversation activity"
            subtitle="How your customer conversations are trending."
          >
            <span className="text-[10px] text-muted-foreground">Oct 6 – 12</span>
          </SectionTitle>
          <div className="chart-legend">
            <span>
              <i className="legend-dot" />
              AI resolved
            </span>
            <span>
              <i className="legend-dot" />
              Escalated to human
            </span>
          </div>
          {isMockMode ? (
            <div className="chart">
              <svg
                viewBox="0 0 480 195"
                width="100%"
                height="100%"
                role="img"
                aria-label="Demo chart: AI resolved conversations increased over seven days; human escalations stayed lower."
              >
                {[20, 60, 100, 140].map((y, i) => (
                  <g key={y}>
                    <line x1="33" y1={y} x2="470" y2={y} className="chart-grid" />
                    <text x="0" y={y + 4} className="chart-text">
                      {240 - i * 60}
                    </text>
                  </g>
                ))}
                <path
                  d="M35 111 C60 111 76 63 105 76 S143 126 178 91 S214 53 250 65 S301 93 323 54 S367 46 395 63 S434 56 467 28"
                  className="chart-line"
                />
                <path
                  d="M35 143 C68 146 77 126 105 132 S153 140 178 130 S221 139 250 133 S296 142 323 126 S368 126 395 135 S442 124 467 119"
                  className="chart-line-secondary"
                />
                {["Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"].map((d, i) => (
                  <text key={d} x={35 + i * 71} y="185" className="chart-text">
                    {d}
                  </text>
                ))}
              </svg>
            </div>
          ) : (
            <p className="text-muted-foreground py-16 text-center">
              Performance analytics not connected.
            </p>
          )}
        </section>
        <section className="data-panel">
          <SectionTitle title="Customer sentiment" subtitle="The feeling behind the feedback." />
          {isMockMode ? (
            <>
              <div className="sentiment-bar">
                <span className="bg-success w-[72%]" />
                <span className="bg-info w-[18%]" />
                <span className="bg-warning w-[10%]" />
              </div>
              {[
                { name: "Positive", value: "72%", count: "924", cls: "bg-success" },
                { name: "Neutral", value: "18%", count: "231", cls: "bg-info" },
                { name: "Negative", value: "10%", count: "129", cls: "bg-warning" },
              ].map((s) => (
                <div className="sentiment-row" key={s.name}>
                  <span className={`online-dot ${s.cls}`} />
                  {s.name}
                  <strong>{s.value}</strong>
                  <small>{s.count}</small>
                </div>
              ))}
              <div className="text-[10px] text-muted-foreground border-t pt-4 mt-4 flex items-center gap-2">
                <HeartHandshake className="size-3.5 text-primary" />
                More understanding. Better outcomes.
              </div>
            </>
          ) : (
            <p className="text-muted-foreground py-16 text-center">
              Sentiment analytics not connected.
            </p>
          )}
        </section>
      </div>
      <div className="mt-7">
        <SectionTitle
          title="Built for better support"
          subtitle="Everything you need to turn conversations into connections."
        />
      </div>
      <div className="feature-grid">
        {[
          {
            icon: BrainCircuit,
            title: "Always-on AI assistance",
            description: "Give customers thoughtful answers, without the wait.",
            to: "/chat",
            link: "Open AI web chat",
          },
          {
            icon: HeartHandshake,
            title: "Sentiment that makes sense",
            description: "Understand how customers feel, not just what they say.",
            to: "/portal",
            link: "Visit customer portal",
          },
          {
            icon: GitBranch,
            title: "Seamless human handoff",
            description: "The right conversation. The right person. The right time.",
            to: "/dashboard",
            link: "View support dashboard",
          },
        ].map((f) => (
          <article className="feature-card" key={f.title}>
            <div className="feature-icon">
              <f.icon className="size-[18px]" />
            </div>
            <h3>{f.title}</h3>
            <p>{f.description}</p>
            <ExploreLink to={f.to as "/chat" | "/portal" | "/dashboard"}>{f.link}</ExploreLink>
          </article>
        ))}
      </div>
      <TicketTable tickets={tickets} compact />
    </div>
  );
}
