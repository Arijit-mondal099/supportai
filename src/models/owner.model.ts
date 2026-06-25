import { model, models, Schema } from "mongoose";

export interface IOwner {
  ownerId: string;
  notionIntegrationToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ownerSchema = new Schema<IOwner>(
  {
    ownerId: { type: String, required: true, unique: true, index: true },
    notionIntegrationToken: { type: String, select: false },
  },
  { timestamps: true },
);

export const OwnerModel = models.Owner || model<IOwner>("Owner", ownerSchema);
