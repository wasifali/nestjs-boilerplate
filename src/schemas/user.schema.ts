import * as mongoose from 'mongoose';

const idpsSchema = new mongoose.Schema(
  {
    provider: { type: String, required: true },
    userId: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    avatar: { type: String, required: false, default: '' },
    email: { type: String, index: { unique: true }, required: true },
    password: { type: String, required: false },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    isShadow: { type: Boolean, default: false },
    idps: { type: [idpsSchema], required: false },
  },
  {
    timestamps: true,
  },
);

export interface UserInterface {
  _id?: string;
  fullName?: string;
  avatar?: string;
  email?: string;
  password?: string;
  isActive?: boolean;
  isVerified?: boolean;
  isShadow?: boolean;
  idps?: IdpsInterface[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IdpsInterface {
  _id?: string;
  provider?: string;
  userId?: string;
}
