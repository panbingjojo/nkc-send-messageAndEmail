import mongoose, {Model, Schema, Document} from "mongoose";

export const ModelName = 'messages';

interface IMessage {
  _id: string
  uid: string,
  toc: Date,
  tlv: Date,
};

