import { describe, expect, it } from "vitest";
import { api, isMockMode } from "@/services/api";

describe("AssistIQ demo service", () => {
  it("creates separate conversations, returns metadata and supports retry", async () => {
    expect(isMockMode).toBe(true);
    const conversation = await api.createConversation();
    api.simulateError();
    const input = { conversationId: conversation.id, message: "I need a refund" };
    await expect(api.sendMessage(input)).rejects.toThrow("Demo connection interrupted");
    const result = await api.sendMessage(input);
    expect(result.conversationId).toBe(conversation.id);
    expect(result.analysis.escalated).toBe(true);
    expect(result.analysis.priority).toBe("High");
    const stored = (await api.getConversations()).find((c) => c.id === conversation.id);
    expect(stored?.messages).toHaveLength(2);
  });
  it("reads back ticket resolution", async () => {
    await api.updateTicket("TK-1048", "Resolved");
    expect((await api.getTickets()).find((t) => t.id === "TK-1048")?.status).toBe("Resolved");
  });
});