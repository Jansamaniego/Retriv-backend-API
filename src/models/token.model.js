import mongoose from 'mongoose';
import toJSON from './plugins';

const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'users'
    },
    expires: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  { timeStamps: true }
);

tokenSchema.plugin(toJSON);

const Token = mongoose.model('Token', tokenSchema);

export default Token;
