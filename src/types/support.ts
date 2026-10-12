export type Sentiment = "Positive" | "Neutral" | "Negative";
export type Priority = "Low" | "Medium" | "High" | "Urgent";
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}
export interface Analysis {
  intent: string;
  sentiment: Sentiment;
  priority: Priority;
  escalated: boolean;
  handoffStatus?: string;
}
export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
  analysis?: Analysis;
}
export interface ChatRequest {
  conversationId: string;
  message: string;
}
export interface ChatResponse {
  conversationId: string;
  message: ChatMessage;
  analysis: Analysis;
}
export interface Ticket {
  id: string;
  title: string;
  customer: string;
  initials: string;
  email: string;
  status: "Open" | "In progress" | "Resolved";
  priority: Priority;
  sentiment: Sentiment;
  category: string;
  createdAt: string;
  description: string;
  conversationId: string;
  escalated: boolean;
}

export const issueCategories = [
  "Technical Issue",
  "Account and Login",
  "Billing and Payments",
  "Order or Service-Related Issue",
  "Bug or Error Report",
  "Feature Request",
  "General Inquiry",
  "Other",
] as const;
export type IssueCategory = (typeof issueCategories)[number];
export const requestedPriorities = ["Low", "Normal", "High", "Urgent"] as const;
export type RequestedPriority = (typeof requestedPriorities)[number];
/** Body sent to POST /api/tickets. AI analysis (intent, sentiment, priority, escalation) is computed by the backend later. */
export interface SupportRequestPayload {
  fullName: string;
  email: string;
  phone: string | null;
  category: IssueCategory;
  subject: string;
  description: string;
  requestedPriority: RequestedPriority;
  productAffected: string | null;
}
export interface SupportRequestResult {
  ticketReference: string;
  /** False when produced by the demo adapter: nothing was saved. */
  persisted: boolean;
  createdAt: string;
}
