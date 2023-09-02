export interface ChatMessageData {
  message: string;
  self: boolean;
  authorId: number;
  profilePicture: string;
  userName: string;
  blocked: boolean;
}