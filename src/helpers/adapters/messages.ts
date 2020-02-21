export const chatsAdapterIn = (chats: any[]): IChat[] => {
  return chats.map(chat => {
    return {
      id: chat.id,
      merchantId: chat.merchantId,
      customerId: chat.customerId,
      isDeleted: chat.isDeleted,
      isArchived: chat.isArchived,
      location: chat.location,
      group: chat.group,
      timestamp: chat.timestamp.toDate().valueOf(),
      type: chat.type,
    };
  });
};

export const messagesAdapterIn = (messages: any[]): IChatMessage[] => {
  return messages.map(message => {
    return {
      id: message.id,
      chatId: message.chatId,
      recipientId: message.recipientId,
      senderId: message.senderId,
      text: message.text,
      timestamp: message.timestamp.toDate().valueOf(),
    };
  });
};
