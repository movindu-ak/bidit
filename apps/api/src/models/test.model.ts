import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    project: { type: String, required: true },
  },
  { timestamps: true }
);

export const TestModel = mongoose.model("Test", testSchema);