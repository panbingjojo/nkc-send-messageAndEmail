import mongoose, {Model, Schema, IDocument} from '../modules/mongoose';

export const ModelName = 'emails';

interface IEmail {
  _id: string,
  uid: string,
  toc: Date,
  tlv: Date,
};

export interface IEmailDocument extends IEmail, IDocument<string> {

};

const EmailSchema = new Schema<IEmailDocument>(
  {
    _id: String,
    uid: {
      type: String,
      required: true,
      index: 1,
    },
    toc: {
      toc: Date,
      required: true,
      index: 1,
    },
    tlv: {
      type: Date,
      required: true,
      index: 1,
    },
  }
)
