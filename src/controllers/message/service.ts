import {MessageBaseInfo} from '../../interfaces/message';
import MessageModel, {IMessageDocument} from '../../models/MessageModel';
export async function CreateMessage(
  messageBaseInfo: MessageBaseInfo,
): Promise<IMessageDocument> {
  const {_id, uid} = messageBaseInfo;
  const time = new Date();
  const message = new MessageModel({
    _id,
    uid,
    toc: time,
    tlv: time,
  });
  await message.save();
  return message;
}
