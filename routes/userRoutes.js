const express = require("express");
const Users = require("../models/userSchema");
const asyncHandler = require("express-async-handler");
const nodeMailer = require("nodemailer");

const router = express.Router();

router.get("/", (req, res) => {
  Users.find({}, (err, users) => {
    if (err) console.log("here is error", err);
    console.log(users);
  });

  res.send("user home");
});

router.post("/otp-verification", (req, res) => {
  const email = req.body.email;
  res.send(email);

  var val = Math.floor(1000 + Math.random() * 9000);
  console.log(val);

  Users.findOne({ email: email }, (err, user) => {
    if (user) {
      res.status(400);
      console.log("user is exist");

      var transport = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: "singhsharad529@gmail.com",
          pass: "Blackboardtable@",
        },
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false,
        },
      });
      var mailOptions = {
        from: "singhsharad529@gmail.com",
        to: user.email,
        subject: "To Verify your Account through a One Time Password",
        text: `Hello , User \n Here is Your One Time Password \n ${val}`,
      };
      transport.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          var today = new Date();

          Users.updateOne(
            { email },
            {
              $set: {
                otp: val,
                time: today,
              },
            },
            (err, res) => {
              if (err) console.log("something went wrong with update the db");
              console.log("otp addedd successfully");
            }
          );
          console.log("email has been sent ", info.response);
        }
      });
    } else {
      res.status(401);
      console.log("user is not exist");
    }
  });
});

router.post("/otp-verify", (req, res) => {
  const { otp, email } = req.body;
  console.log("otp verification processing ", otp, "  ", email);

  Users.findOne({ email: email }, (err, user) => {
    if (user) {
      res.status(400);
      console.log("user is exist");
      if (user.otp == otp) {
        console.log("otp verified");

        const getotp = user.otp;
        const gettime = user.time.getTime();

        const today = new Date();
        const time = today.getTime();

        console.log(
          "otp from db ",
          getotp,
          "  ",
          "otp from request ",
          otp,
          " ",
          "gettime from db ",
          gettime,
          " current time ",
          time
        );

        var minutespast = Math.floor(gettime / 60000);
        var minutescurrent = Math.floor(time / 60000);

        console.log(
          "current minutues ",
          minutescurrent,
          " past minutes ",
          minutespast
        );

        if (minutescurrent - minutespast <= 1) {
          res.status(200).json("welcome back");
        } else {
          console.log("session expired");
        }
      } else {
        console.log("otp is not correct");
      }
    } else {
      console.log("something went wrong to varify the otp");
    }
  });
});

module.exports = router;
