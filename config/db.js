const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://sharad:Sharad123@cluster0.w1dne.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
      }
    );
    console.log("mongo db connected");
  } catch (error) {
    console.log(`error : ${error.message}`);
    process.exit();
  }
};

module.exports = connectDB;
