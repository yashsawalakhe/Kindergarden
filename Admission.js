import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema({
  child_name: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  parent_name: { type: String, required: true },
  email: String,
  phone: { type: String, required: true },
  address: { type: String, required: true },
  message: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Admission", admissionSchema);
