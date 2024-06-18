import { Schema, model, models } from "mongoose";
import { handleMongooseError, validateAtUpdate } from "./hooks.js";
const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for project"],
    },
    type: {
      type: String,
      required: [true, "Set type for project"],
    },
    description: {
      type: String,
      required: [true, "Set description for project"],
    },
    time: {
      type: String,
      required: [true, "Set time for project"],
    },
    format: {
      type: String,
      required: [true, "Set format for project"],
    },
    links: {
      type: [String],
      required: false,
      default: [],
    },
    soundtrack: {
      type: String,
      required: [true, "Set soundtrack for project"],
    },
    status: {
      type: String,
      required: [true, "Set status for project"],
    },
    deadline: {
      type: Date, // Тип даних - Date
      required: true, // Поле обов'язкове
    },
    storyId: {
      type: Number, // Тип даних - Date
      required: true, // Поле обов'язкове
    },
    uploadedtrack: {
      type: [String], // Масив строкових значень
      required: false,
      default: [], // Дефолтне значення - пустий масив
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    files: {
      type: [String], // Масив строкових значень
      required: false,
      default: [], // Дефолтне значення - пустий масив
    },
    comments: {
      type: [
        {
          text: {
            type: String,
            required: false,
          },
          author: {
            type: String,
            required: false,
          },
          date: {
            type: Date,
            required: false,
          },
          // Додаткові властивості коментаря можна додавати тут
        },
      ],
      default: [], // Поле comments буде пустим масивом за замовчуванням
    },
  },
  { versionKey: false, timestamps: true }
);

projectSchema.pre("findOneAndUpdate", validateAtUpdate);
projectSchema.post("save", handleMongooseError);
projectSchema.post("findOneAndUpdate", handleMongooseError);

const Project = models.Project || model("Project", projectSchema);

export default Project;
