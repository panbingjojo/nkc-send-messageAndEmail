import {Document, Schema, Model, Types} from 'mongoose';
import {mongoose} from './database';

interface IDocument<T> extends Omit<Document, '_id'> {
  _id: T;
}

export {mongoose as default, IDocument, Document, Schema, Model, Types};
