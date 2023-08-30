export default interface PayloadAction {
  message?: string;
  action: string;
  targetId?: number;
  roomName?: string;
  targetRoom?: string;
  name?: string;
  password?: string;
  type?: string;
  text?: string;
}
