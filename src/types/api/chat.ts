import type { IChatParticipant, IChatConversation } from '../chat';

// ----------------------------------------------------------------------

export interface ContactsResponse {
  contacts: IChatParticipant[];
}

export interface ConversationsResponse {
  conversations: IChatConversation[];
}

export interface ConversationResponse {
  conversation: IChatConversation;
}
