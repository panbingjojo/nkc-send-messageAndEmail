import mongoose, {Schema, Document, Model} from '../modules/mongoose';
export const ModelName = 'settings';
interface ISetting {
  counter: {
    users: number;
    roles: number;
  };
}

export interface ISettingDocument extends ISetting, Document {}

interface ISettingModel extends Model<ISettingDocument> {
  getNewId: (modelName: string, inc: number) => Promise<string>;
}

const SettingSchema = new Schema<ISettingDocument>(
  {
    counter: {
      users: {
        type: Number,
        default: 0,
      },
      roles: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    collection: ModelName,
  },
);

SettingSchema.statics.getNewId = async function (
  modelName: string,
  inc: number,
) {
  interface UpdateBody {
    $inc: {
      [proName: string]: number;
    };
  }
  interface SettingResult {
    counter: {
      [proName: string]: number;
    };
  }

  const updateBody: UpdateBody = {
    $inc: {},
  };
  updateBody.$inc[`counter.${modelName}`] = inc;
  const setting = await (this as ISettingModel).findOneAndUpdate(
    {},
    updateBody,
  );
  return (setting as SettingResult).counter[modelName] + 1;
};

export default mongoose.model<ISettingDocument, ISettingModel>(
  ModelName,
  SettingSchema,
);
