import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { MongoClient } from "mongodb";

/* Be sure to use DATABASE_NAME in your call to .db(), so we can change the constant while grading. */
let DATABASE_NAME = "cs193x_assign3";
let DATABASE_URL = "mongodb://127.0.0.1";

/* Do not modify or remove this line. It allows us to change the database for grading */
if (process.env.DATABASE_NAME) DATABASE_NAME = process.env.DATABASE_NAME;

let api = express.Router();
let users;
let posts;

const initApi = async (app) => {
  app.set("json spaces", 2);
  app.use("/api", api);

  //TODO: Set up database connection and collection variables
  let conn = await MongoClient.connect(DATABASE_URL);
  let db = conn.db(DATABASE_NAME);
  users = db.collection("users");
  posts = db.collection("posts");
};

api.use(bodyParser.json());
api.use(cors());

api.get("/", async (req, res) => {
  let usersArray = await users.find({}).toArray();
  let postsArray = await users.find({}).toArray();
  res.json({
    db: DATABASE_NAME,
    numUsers: usersArray.length,
    numPosts: postsArray.length,
  });
});

api.get("/users", async (req, res) => {
  let usersArray = await users.find({}).toArray();
  let data = { users: [] };
  for (let i of usersArray) {
    data.users.push(i.id);
  }
  res.json(data);
});

api.get("/users/*/posts", async (req, res) => {
  let data = {
    posts: [],
  };
  let userId = req.url.split("/")[2];
  let user = await users.find({ id: userId }).toArray();
  if (user.length !== 1) {
    res.status(404).json({ error: `No user with ID ${userId}` });
    return;
  }
  let postArray = await posts.find({ userId: userId }).toArray();
  for (let i of postArray) {
    data.posts.push({
      user: {
        id: user[0].id,
        name: user[0].name,
        avatarURL: user[0].avatarURL,
      },
      time: i.time,
      text: i.text,
    });
  }
  for (let followId of user[0].following) {
    let followUser = await users.find({ id: followId }).toArray();
    let followPostArray = await posts.find({ userId: followId }).toArray();
    for (let i of followPostArray) {
      data.posts.push({
        user: {
          id: followUser[0].id,
          name: followUser[0].name,
          avatarURL: followUser[0].avatarURL,
        },
        time: i.time,
        text: i.text,
      });
    }
  }
  data.posts.sort((lhs, rhs) => {
    if (lhs.time > rhs.time) {
      return -1;
    }
    if (lhs.time < rhs.time) {
      return 1;
    }
    return 0;
  });
  res.json(data);
});

api.get("/users/*", async (req, res) => {
  let userId = req.url.split("/")[2];
  let user = await users.find({ id: userId }).toArray();
  if (user.length !== 1) {
    res.status(404).json({ error: `No user with ID ${userId}` });
    return;
  }
  res.json({
    id: userId,
    name: user[0].name,
    avatarURL: user[0].avatarURL,
    following: user[0].following,
  });
});

api.post("/users", async (req, res) => {
  if (!req.body.id || req.body.id.length === 0) {
    res.status(400).json({
      error: "the request body is missing an id property or the id is empty",
    });
    return;
  }
  let newUserId = req.body.id;
  let newUserName = req.body.name;
  let user = await users.find({ id: newUserId }).toArray();
  if (user.length !== 0) {
    res.status(400).json({ error: "the user already exits" });
    return;
  }
  let data = {
    id: newUserId,
    name: newUserName,
    avatarURL: "images/default.png",
    following: [],
  };
  await users.insertOne(data);
  delete data._id;
  res.json(data);
});

api.patch("/users/*", async (req, res) => {
  let userId = req.url.split("/")[2];
  let user = await users.find({ id: userId }).toArray();
  if (user.length !== 1) {
    res.status(404).json({ error: `No user with ID ${userId}` });
    return;
  }
  let newName = req.body.name;
  let newAvatarURL = req.body.avatarURL;
  if (newName) {
    if (newName.length == 0) {
      newName = userId;
    }
    await users.updateOne({ id: userId }, { $set: { name: newName } });
  }
  if (newAvatarURL) {
    if (newAvatarURL.length === 0) {
      newAvatarURL = "images/default.png";
    }
    await users.updateOne(
      { id: userId },
      { $set: { avatarURL: newAvatarURL } },
    );
  }
  user = await users.find({ id: userId }).toArray();
  delete user[0]._id;
  res.json(user[0]);
});

api.post("/users/*/feed", async (req, res) => {
  let userId = req.url.split("/")[2];
  let user = await users.find({ id: userId }).toArray();
  if (user.length !== 1) {
    res.status(404).json({ error: `No user with ID ${userId}` });
    return;
  }
  if (!req.body.text || req.body.text.length === 0) {
    res.status(400).json({
      error:
        "the request body is missing a text property or the textt is empty",
    });
    return;
  }
  await posts.insertOne({
    userId: userId,
    time: new Date(),
    text: req.body.text,
  });
  res.json({ success: true });
});

api.post("/users/*/follow", async (req, res) => {
  let userId = req.url.split("/")[2];
  let user = await users.find({ id: userId }).toArray();
  let targetId = req.query.target;
  if (!targetId || targetId.length === 0) {
    res.status(400).json({
      error:
        "the query string is missing a target property, or the target is empty",
    });
    return;
  }
  let targetUser = await users.find({ id: targetId }).toArray();
  if (userId === targetId) {
    res.status(400).json({ error: "user is the same as the target" });
    return;
  }
  if (user.length !== 1 || targetUser.length !== 1) {
    res.status(404).json({ error: "user id or target does not exist" });
    return;
  }
  let flag = false;
  let following = user[0].following;
  following.forEach((element) => {
    if (element === targetId) {
      flag = true;
    }
  });

  if (flag) {
    res.status(400).json({ error: "user is already following the target" });
    return;
  }

  following.push(targetId);
  await users.updateOne({ id: userId }, { $set: { following: following } });
  res.json({ success: true });
});

api.delete("/users/*/follow", async (req, res) => {
  let userId = req.url.split("/")[2];
  let user = await users.find({ id: userId }).toArray();
  let targetId = req.query.target;
  if (!targetId || targetId.length === 0) {
    res.status(400).json({
      error:
        "the query string is missing a target property, or the target is empty",
    });
    return;
  }
  let targetUser = await users.find({ id: targetId }).toArray();
  if (userId === targetId) {
    res.status(400).json({ error: "user is the same as the target" });
    return;
  }
  if (user.length !== 1 || targetUser.length !== 1) {
    res.status(404).json({ error: "user id or target does not exist" });
    return;
  }
  let flag = false;
  let following = user[0].following;
  following.forEach((element) => {
    if (element === targetId) {
      flag = true;
    }
  });

  if (!flag) {
    res.status(400).json({
      error: "target user isn't being followed by the requesting user",
    });
    return;
  }

  following = following.filter((item) => item !== targetId);
  await users.updateOne({ id: userId }, { $set: { following: following } });
  res.json({ success: true });
});

/*** Test routes ***/

api.get("/tests/get", async (req, res) => {
  let value = req.query.value || null;
  res.json({ success: true, value });
});

api.post("/tests/post", (req, res) => {
  let value = req.body.value || null;
  res.json({ success: true, value });
});

api.get("/tests/error", (req, res) => {
  res.status(499).json({ error: "Test error" });
});

api.all("/tests/echo", (req, res) => {
  res.json({
    method: req.method,
    query: req.query,
    body: req.body,
  });
});

/*** Generic Social Media API ***/

//TODO: Add endpoints

/* Catch-all route to return a JSON error if endpoint not defined.
   Be sure to put all of your endpoints above this one, or they will not be called. */

api.all("/*", (req, res) => {
  res
    .status(404)
    .json({ error: `Endpoint not found: ${req.method} ${req.url}` });
});

export default initApi;
