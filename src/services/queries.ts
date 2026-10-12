import { queryOptions } from '@tanstack/react-query';
import { api } from './api';
export const ticketsQuery = queryOptions({queryKey:['tickets'],queryFn:api.getTickets});
export const conversationsQuery = queryOptions({queryKey:['conversations'],queryFn:api.getConversations});
