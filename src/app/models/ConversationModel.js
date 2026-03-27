import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      required: true,
      validate: [v => v.length === 2, "Conversation must have exactly 2 participants"],
    },
    lastMessage: {
      type: String,
      default: "",
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const ConversationModel =
  mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);

export default ConversationModel;
