import {EmailBaseInfo} from './interfaces';
import EmailModel, {IEmailDocument} from '../../models/EmailModel';
export async function CreateEmail(
  emailBaseInfo: EmailBaseInfo,
): Promise<IEmailDocument> {
  const {ip, uid, email, code, type} = emailBaseInfo;
  const time = new Date();
  const Email = new EmailModel({
    ip,
    uid,
    email,
    code,
    type,
    toc: time,
    tlv: time,
  });
  await Email.save();
  return Email;
}
