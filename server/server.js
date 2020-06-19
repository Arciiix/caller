const express = require("express");
const app = express();

const localPort = 3232; //This is a port used when deploying the app on local machine.
const port = process.env.PORT || localPort; //This is the final port - local (look higher) or auto (when on the hosting service)

//Import users data (such a passwords and names), DEV TODO temporarily from js module - in official version it should be from database
const users = require("./users.js");
const jwt = require("jsonwebtoken");
const SECRET = require("./secret.js");

const server = app.listen(port, () => {
  //Displaying a message about starting
  console.log(`[${formatDate(new Date())}] App has started on port ${port}!`);
});

//Fix errors caused by the cors
const cors = require("cors");
app.use(cors());

//Import mobile notifications modules
const mobile = require("./mobile.js");
const sendNotification = mobile.sendNotification;
const { Expo } = require("expo-server-sdk");

//Set the static path to the path of the site
app.use(express.static("./site/"));

//Format a date into HH:MM DD.MM.YYYY format.
function formatDate(date) {
  return `${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:${
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
  }:${date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()} ${
    date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
  }.${
    date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  }.${date.getFullYear()}`;
}

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.get("/login", (req, res) => {
  if (!req.query.password) return res.sendStatus(403);
  let user = users.find((element) => element.password === req.query.password);
  if (!user) return res.sendStatus(403);
  let token = jwt.sign({ id: user.id, name: user.name }, SECRET, {
    expiresIn: "15m",
  });
  console.log(
    `[${formatDate(new Date())}] New user (id ${user.id}) with name ${
      user.name
    } has logged!`
  );
  res.status(200);
  res.send(token);
});

app.get("/verify", (req, res) => {
  if (!req.query.token) return res.sendStatus(403);
  let isLogged = jwt.verify(req.query.token, SECRET);
  if (isLogged) {
    res.status(200);
    res.send("true");
  } else {
    res.status(403);
    res.send("false");
  }
});

app.get("/setNotification", (req, res) => {
  if (!req.query.token || !req.query.room) return res.sendStatus(403);
  if (!Expo.isExpoPushToken(req.query.token)) return res.sendStatus(403);
  if (io.nsps["/"].adapter.rooms[req.query.room]) {
    let room = io.nsps["/"].adapter.rooms[req.query.room];
    room.notificationToken = req.query.token;
    room.prevType = room.currentType;
    room.currentType = "mobilePush";
    room.isActive = true;
    console.log(
      `[${formatDate(new Date())}] Set new notification token to the room ${
        req.query.room
      } `
    );
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  socket.join(socket.handshake.query.room);
  let room = io.nsps["/"].adapter.rooms[socket.handshake.query.room];
  //I set the type of the device and current used type (so this type) in the room with that socket id
  if (socket.handshake.query.type !== "readonly") {
    room[socket.handshake.query.type] = socket.id;
    if (socket.handshake.query.type !== "sender") {
      //When it's a receiver
      //but it isn't mobile, save the current type to "prevType"
      if (room.currentType != "mobile" && room.currentType != "mobilePush") {
        room.prevType = room.currentType;
      }
      room.currentType = socket.handshake.query.type;
      room.isActive = true;
    }
  }
  console.log(
    `[${formatDate(new Date())}] New socket with type ${
      socket.handshake.query.type
    } connected to room ${socket.handshake.query.room}`
  );

  socket.on("call", (data) => {
    let room = io.nsps["/"].adapter.rooms[data.room];
    if (room.currentType) {
      //If a receiver is online, send him the message and send the reply to the sender that it was done, else - send the alert about offline status
      if (room.currentType !== "mobilePush") {
        io.to(room[room.currentType]).emit("calling", {
          message: data.message,
          name: data.name,
        });
        io.to(room.sender).emit("statusUpdate", "sent");
      } else {
        sendNotification(room.notificationToken, data.name, data.message);
        io.to(room.sender).emit("statusUpdate", "sent");
      }
      data.date = new Date().getTime();
      console.log(data);
      room.lastMessage = data;
    } else {
      io.to(room.sender).emit("statusUpdate", "offline");
    }
  });

  socket.on("statusUpdate", (status) => {
    let room = io.nsps["/"].adapter.rooms[status.room];
    if (status.status === "turnOnNotifications") {
      room.currentType = "mobilePush";
      console.log(
        `[${formatDate(
          new Date()
        )}] Changed current type to mobilePush in room ${status.room}`
      );
      return;
    }
    //Send the status to wanted receiver
    io.to(room[status.toSender ? "sender" : room.currentType]).emit(
      "statusUpdate",
      status.status
    );
    console.log(
      `[${formatDate(new Date())}] Updated ${
        status.toSender ? "sender" : "receiver"
      } status - ${status.status}`
    );
  });

  //When someone sends a message
  socket.on("message", (message) => {
    let room = io.nsps["/"].adapter.rooms[message.room];
    //Send the status to wanted receiver
    io.to(room[message.toSender ? "sender" : room.currentType]).emit(
      "message",
      message.message
    );
    console.log(
      `[${formatDate(new Date())}] ${
        message.toSender
          ? room.currentType.charAt(0).toUpperCase() + room.currentType.slice(1)
          : "Sender"
      } sent a message: ${message.message}`
    );
  });

  socket.on("isActive", (room) => {
    if (io.nsps["/"].adapter.rooms[room].isActive) {
      socket.emit("isActive", {
        isActive: true,
        type: io.nsps["/"].adapter.rooms[room].currentType,
      });
    } else {
      socket.emit("isActive", { isActive: false });
    }
  });

  socket.on(`changeToPrevType`, (roomName) => {
    if (io.nsps["/"].adapter.rooms[roomName].prevType) {
      let room = io.nsps["/"].adapter.rooms[roomName];
      //Swap the current type with the previous one
      [room.currentType, room.prevType] = [room.prevType, room.currentType];
      console.log(
        `[${formatDate(new Date())}] Changed the current type from ${
          room.prevType
        } to ${room.currentType}`
      );
    }
  });

  socket.on("lastMessage", (roomName) => {
    socket.emit(
      "lastMessage",
      io.nsps["/"].adapter.rooms[roomName].lastMessage
    );
  });
});
