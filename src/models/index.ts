import EmailModel, {
  IEmailDocument,
  ModelName as EmailModelName,
} from './EmailModel';
import MessageModel, {
  IMessageDocument,
  ModelName as MessageModelName,
} from './MessageModel';
import SendSettingModel, {
  ISendSettingDocument,
  ModelName as SendSettingName,
} from './SendSettingModel';
import SettingModel, {
  ISettingDocument,
  ModelName as SettingModelName,
} from './SettingModel';

export {EmailModel, MessageModel, SendSettingModel, SettingModel};
export {
  IEmailDocument,
  ISendSettingDocument,
  IMessageDocument,
  ISettingDocument,
};
export {EmailModelName, MessageModelName, SendSettingName, SettingModelName};
