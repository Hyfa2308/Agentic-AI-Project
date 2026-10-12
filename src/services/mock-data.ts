import type { Conversation, Ticket } from "@/types/support";
export const demoConversations: Conversation[] = [
  {
    id: "conv-1001",
    title: "Refund for duplicate payment",
    updatedAt: "2026-10-12T09:42:00Z",
    analysis: {
      intent: "Billing inquiry",
      sentiment: "Negative",
      priority: "High",
      escalated: true,
      handoffStatus: "Waiting for a support specialist",
    },
    messages: [
      {
        id: "m1",
        role: "user",
        content:
          "I was charged twice for my subscription this month. Can you help me get a refund?",
        createdAt: "2026-10-12T09:40:00Z",
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "I understand how frustrating an unexpected charge can be. I’ve flagged this billing issue for a support specialist who can review both payments and help with your refund.",
        createdAt: "2026-10-12T09:42:00Z",
      },
    ],
  },
  {
    id: "conv-1002",
    title: "Update my shipping address",
    updatedAt: "2026-10-12T08:30:00Z",
    messages: [
      {
        id: "m3",
        role: "user",
        content: "Can I update the shipping address on my order?",
        createdAt: "2026-10-12T08:30:00Z",
      },
      {
        id: "m4",
        role: "assistant",
        content:
          "I can help with that. Please share your order number so we can review its current shipping status.",
        createdAt: "2026-10-12T08:30:10Z",
      },
    ],
  },
  {
    id: "conv-1003",
    title: "Getting started with my account",
    updatedAt: "2026-10-11T14:20:00Z",
    messages: [
      {
        id: "m5",
        role: "assistant",
        content: "Welcome! What can I help you with today?",
        createdAt: "2026-10-11T14:20:00Z",
      },
    ],
  },
];
export const demoTickets: Ticket[] = [
  {
    id: "TK-1048",
    title: "Refund for duplicate payment",
    customer: "Olivia Rhye",
    initials: "OR",
    email: "olivia@example.com",
    status: "Open",
    priority: "High",
    sentiment: "Negative",
    category: "Billing",
    createdAt: "2026-10-12T09:42:00Z",
    description:
      "Customer reports two subscription charges in October and requests a refund. Payment records need to be reviewed by a billing specialist.",
    conversationId: "conv-1001",
    escalated: true,
  },
  {
    id: "TK-1047",
    title: "Unable to access my account",
    customer: "Phoenix Baker",
    initials: "PB",
    email: "phoenix@example.com",
    status: "In progress",
    priority: "Urgent",
    sentiment: "Negative",
    category: "Account",
    createdAt: "2026-10-12T09:18:00Z",
    description:
      "Customer is locked out after resetting their password. Verify account ownership and investigate the sign-in issue.",
    conversationId: "conv-1003",
    escalated: true,
  },
  {
    id: "TK-1046",
    title: "Update my shipping address",
    customer: "Lana Steiner",
    initials: "LS",
    email: "lana@example.com",
    status: "Open",
    priority: "Medium",
    sentiment: "Neutral",
    category: "Orders",
    createdAt: "2026-10-12T08:30:00Z",
    description:
      "Customer would like to change the delivery address before their order is dispatched.",
    conversationId: "conv-1002",
    escalated: false,
  },
  {
    id: "TK-1045",
    title: "Subscription upgrade question",
    customer: "Demi Wilkinson",
    initials: "DW",
    email: "demi@example.com",
    status: "Resolved",
    priority: "Low",
    sentiment: "Positive",
    category: "Subscription",
    createdAt: "2026-10-12T07:20:00Z",
    description:
      "Customer asked about upgrading their subscription. Plan information was provided and the issue was resolved.",
    conversationId: "conv-1003",
    escalated: false,
  },
  {
    id: "TK-1044",
    title: "Order arrived with missing items",
    customer: "Drew Cano",
    initials: "DC",
    email: "drew@example.com",
    status: "Open",
    priority: "High",
    sentiment: "Negative",
    category: "Orders",
    createdAt: "2026-10-11T16:10:00Z",
    description:
      "Two items were missing from the delivered order. A specialist needs to review the packing details and arrange a replacement.",
    conversationId: "conv-1001",
    escalated: true,
  },
];
