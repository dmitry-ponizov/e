type ChatType = 'feedback' | 'dispute' | 'direct';

interface IChatLocation {
  id: string;
  name: string;
}

interface IChatGroup {
  id: string;
  name: string;
}

interface IChat {
  id: string;
  merchantId: string;
  customerId: string;
  isArchived: boolean;
  isDeleted: boolean;
  location: IChatLocation;
  group: IChatGroup;
  timestamp: number;
  type: ChatType;
  TEST?: boolean;
}

interface IChatMessage {
  id: string;
  chatId: string;
  recipientId: string;
  senderId: string;
  text: string;
  timestamp: number;
}
