import { Document, model, Schema } from "mongoose";

// Define the User interface
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: "admin" | "user" | "owner";
  createdAt: Date;
  updatedAt: Date;
}

// Define the User schema
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String },
    role: { type: String, enum: ["admin", "user", "owner"], default: "user" },
  },
  {
    timestamps: true,
  },
);

// Set the toJSON transformation to exclude the password field when converting to JSON
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

export const UserModel = model<IUser>("User", userSchema);
