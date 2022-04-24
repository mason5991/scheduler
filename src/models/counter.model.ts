import mongoose, { Schema, Document } from 'mongoose';

export interface CounterModel {
  counterId: string;
  sequenceValue: number;
}

const CounterSchema = new Schema({
  counterId: { type: String, default: null },
  sequenceValue: { type: Number, default: 0 },
});

export const collectionName = 'counters';

export const Counter = mongoose.model<CounterModel>(
  collectionName,
  CounterSchema,
);

export const getNextSequenceValue = async (counterId: string) => {
  const { sequenceValue } = await Counter.findOneAndUpdate(
    { counterId },
    {
      $inc: {
        sequenceValue: 1,
      },
    },
    {
      new: true,
      upsert: true,
    },
  ).exec();

  return counterId + sequenceValue.toString().padStart(10, '0');
};

export default Counter;
