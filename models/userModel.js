import { Schema, model, models } from "mongoose";
import { handleMongooseError, validateAtUpdate } from "./hooks.js";
import { emailRegexp } from "./constants.js";
const userSchema = new Schema({
  phone: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email is required"],

    match: emailRegexp,
  },
  name: {
    type: String,
    required: [true, "Set name for user"],
  },
  soname: {
    type: String,
    required: [true, "Set soname for user"],
  },
  id: {
    type: String,
    required: [true, "Set id for user"],
  },
});
userSchema.pre("findOneAndUpdate", validateAtUpdate);

userSchema.post("save", handleMongooseError);
userSchema.post("findOneAndUpdate", handleMongooseError);

const User = models.User || model("User", userSchema);

export default User;
