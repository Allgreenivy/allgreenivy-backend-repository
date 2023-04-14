import mongoose from "mongoose"; // Erase if already required


export interface UserAttributes {
  _id: string
  lastName: string;
  firstName: string;
  email: string;
  password: string;
  phoneNumber: string
  areaOfInterest: string;
  role: [string];
  verified: boolean;
  salt: string;
  timestamps: boolean
  // averageRating: number;
}
// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema<UserAttributes>({
  lastName: {
    type: String,
    required: true,
    index: true,
  },
    firstName: {
    type: String,
    required: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  timestamps: true,

  role: {
    type: [String],
    default: ["Student"],
    enum: ["Student", "Instructor", "Admin",  ]
  }
}
);

//Export the model
export const userModel = mongoose.model<UserAttributes>("userModel", userSchema);


