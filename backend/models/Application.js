import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    // Ye field batata hai ki ye application KIS user ki hai.
    // ref: "User" ka matlab hai ye User collection ke _id ko point karta hai.
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    status: {
      type: String,
      enum: ["applied", "oa", "interview", "offer", "rejected"], // in 5 values ke alawa kuch save nahi hoga
      default: "applied",
    },
    appliedDate: { type: Date, default: Date.now },
    notes: { type: String, default: "" },
    link: { type: String, default: "" }, // job posting ka link
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
