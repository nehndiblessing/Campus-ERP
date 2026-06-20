import mongoose from "mongoose";

const markSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    examType: {
      type: String,
      enum: [
        "Quiz",
        "Midterm",
        "Final",
      ],
      required: true,
    },

    marks: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Mark",
  markSchema
);