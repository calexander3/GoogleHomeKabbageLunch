export interface GoogleHomeRequest {
  lang: string;
  status: Status;
  timestamp: string;
  sessionId: string;
  result: Result;
  id: string;
  originalRequest: OriginalRequest;
}
export interface Status {
  errorType: string;
  code: number;
}
export interface Result {
  parameters: Parameters;
  contexts?: (null)[] | null;
  resolvedQuery: string;
  source: string;
  score: number;
  speech: string;
  fulfillment: Fulfillment;
  actionIncomplete: boolean;
  action: string;
  metadata: Metadata;
}
export interface Parameters {
  date: string;
}
export interface Fulfillment {
  messages?: (MessagesEntity)[] | null;
  speech: string;
  displayText: string;
  source: string;
}
export interface MessagesEntity {
  speech?: string;
  imageUrl?: string;
  type: number;
}
export interface Metadata {
  intentId: string;
  webhookForSlotFillingUsed: string;
  intentName: string;
  webhookUsed: string;
}
export interface OriginalRequest {
  source: string;
  data: Data;
}
export interface Data {
  inputs?: (InputsEntity)[] | null;
  user: User;
  conversation: Conversation;
}
export interface InputsEntity {
  raw_inputs?: (RawInputsEntity)[] | null;
  intent: string;
  arguments?: (ArgumentsEntity)[] | null;
}
export interface RawInputsEntity {
  query: string;
  input_type: number;
}
export interface ArgumentsEntity {
  text_value: string;
  raw_text: string;
  name: string;
}
export interface User {
  user_id: string;
}
export interface Conversation {
  conversation_id: string;
  type: number;
  conversation_token: string;
}
