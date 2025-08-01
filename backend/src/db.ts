import mongoose, { Schema, ObjectId } from "mongoose"

const userSchema = new Schema({
    email: {type: String, unique: true},
    password: String,
    name: String,

});

const userModel = mongoose.model("user", userSchema)

export { userModel }