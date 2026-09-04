import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Ye schema define karta hai ki ek "User" document DB mein kaisa dikhega
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // yahan hamesha HASHED password store hoga, plain text kabhi nahi
  },
  { timestamps: true } // createdAt, updatedAt apne aap add ho jayenge
);

// Mongoose "pre-save hook" — jab bhi user.save() call hoga, ye function
// save hone se PEHLE chalega. Isse hum password ko save hone se pehle hash kar dete hain.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // agar password change hi nahi hua, skip
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method — login ke time plain password ko DB ke hashed password se compare karega
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
