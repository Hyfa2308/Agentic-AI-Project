export type Sentiment = 'Positive' | 'Neutral' | 'Negative';
export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export interface ChatMessage { id: string; role: 'user' | 'assistant'; content: string; createdAt: string }
export interface Analysis { intent: string; sentiment: Sentiment; priority: Priority; escalated: boolean; handoffStatus?: string }
export interface Conversation { id: string; title: string; messages: ChatMessage[]; updatedAt: string; analysis?: Analysis }
export interface ChatRequest { conversationId: string; message: string }
export interface ChatResponse { conversationId: string; message: ChatMessage; analysis: Analysis }
export interface Ticket { id: string; title: string; customer: string; initials: string; email: string; status: 'Open' | 'In progress' | 'Resolved'; priority: Priority; sentiment: Sentiment; category: string; createdAt: string; description: string; conversationId: string; escalated: boolean }
