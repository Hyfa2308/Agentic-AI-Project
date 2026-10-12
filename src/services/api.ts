import type { ChatRequest, ChatResponse, Conversation, Ticket } from '@/types/support';
import { demoConversations, demoTickets } from './mock-data';
const baseUrl = import.meta.env['VITE_API_BASE_URL']?.replace(/\/$/, '') ?? '';
export const isMockMode = import.meta.env['VITE_USE_MOCK_API'] === 'true' || !baseUrl;
let conversations = structuredClone(demoConversations);
let tickets = structuredClone(demoTickets);
let failNext = false;
async function request<T>(path: string, init?: RequestInit): Promise<T> {
 const controller = new AbortController(); const timeout = setTimeout(()=>controller.abort(),30000);
 try { const response = await fetch(`${baseUrl}${path}`, { ...init, headers:{'Content-Type':'application/json',...init?.headers},signal:controller.signal });
 if(!response.ok) throw new Error(`The support service could not complete your request (${response.status}). Please try again.`);
 return await response.json() as T;
 } catch(error) { if(error instanceof Error && error.name === 'AbortError') throw new Error('The support service took too long to respond. Please retry.'); throw error; } finally {clearTimeout(timeout);}
}
const pause = () => new Promise(resolve=>setTimeout(resolve,900));
export const api = {
 getConversations: async ():Promise<Conversation[]> => isMockMode ? structuredClone(conversations) : request('/conversations'),
 getTickets: async ():Promise<Ticket[]> => isMockMode ? structuredClone(tickets) : request('/tickets'),
 createConversation: async ():Promise<Conversation> => { if(!isMockMode) return request('/conversations',{method:'POST',body:JSON.stringify({})}); const c:Conversation={id:crypto.randomUUID(),title:'New conversation',messages:[],updatedAt:new Date().toISOString()}; conversations=[c,...conversations];return structuredClone(c); },
 sendMessage: async (input:ChatRequest):Promise<ChatResponse> => {
 if(!isMockMode) return request('/chat',{method:'POST',body:JSON.stringify(input)});
 await pause(); if(failNext){failNext=false;throw new Error('Demo connection interrupted. Your message was not sent. Please retry.');}
 const escalated = /refund|angry|frustrat|human|twice|broken|urgent/i.test(input.message);
 const response:ChatResponse={conversationId:input.conversationId,message:{id:crypto.randomUUID(),role:'assistant',content:escalated?'I understand your concern. In this demo, your conversation has been escalated to a support specialist. They will receive the conversation context so you won’t need to repeat yourself.':'Thanks for reaching out. This is a demo response from AssistIQ. Could you share a few more details about your issue so we can find the right next step?',createdAt:new Date().toISOString()},analysis:{intent:/refund|payment|bill/i.test(input.message)?'Billing inquiry':'General support',sentiment:escalated?'Negative':'Neutral',priority:escalated?'High':'Low',escalated,...(escalated?{handoffStatus:'Waiting for a support specialist'}:{})}};
 const conversation=conversations.find(c=>c.id===input.conversationId); if(conversation){conversation.messages.push({id:crypto.randomUUID(),role:'user',content:input.message,createdAt:new Date().toISOString()},response.message);conversation.analysis=response.analysis;conversation.title=input.message.slice(0,40);conversation.updatedAt=response.message.createdAt;}
 return response;
 },
 updateTicket: async(id:string,status:Ticket['status']):Promise<Ticket> => {if(!isMockMode)return request(`/tickets/${encodeURIComponent(id)}`,{method:'PATCH',body:JSON.stringify({status})});await pause();const ticket=tickets.find(t=>t.id===id);if(!ticket)throw new Error('Ticket not found');ticket.status=status;return structuredClone(ticket);},
 simulateError:()=>{if(isMockMode)failNext=true;}
};
