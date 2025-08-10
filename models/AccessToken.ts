import mongoose, { model, models, Schema, Types } from "mongoose";

export interface IAccessToken {
  tokenHash: string;
  userId: Types.ObjectId;
  scope: string[];
  expiresAt: Date;
  revoked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const AccessTokenSchema = new mongoose.Schema<IAccessToken>(
  {
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scope: {
      type: [String],
      default: [],
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    revoked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default models.AccessToken ||
  model<IAccessToken>("AccessToken", AccessTokenSchema);
