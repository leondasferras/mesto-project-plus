import  {  model, Schema } from 'mongoose';

interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Array<Schema.Types.ObjectId>;
  createdAt:Date;
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  owner: {
    type:Schema.Types.ObjectId,
    required: true
  },
  likes: {
    default:[],
    type: [Schema.Types.ObjectId],
    ref:'User'
  },
  createdAt: {
    type:Date,
    default: Date.now()
  }
})

export default model<ICard>('Card', cardSchema);