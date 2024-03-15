import bodyParser from "body-parser";
import express from "express";

const api = new express.Router();

const initApi = (app) => {
  app.set("json spaces", 2);
  app.use("/api", api);
};

api.use(bodyParser.json());

api.get("/", (req, res) => {
  res.json({ db: "local_api", numUsers: 1, numPosts: 1 });
});

api.get("/tests/get", (req, res) => {
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

// Phương thức GET để lấy danh sách tất cả người dùng
api.get("/users", (req, res) => {
  // Trả về danh sách tất cả người dùng
  res.json({ users });
});

// api.get("/users/mchang", (req, res) => {
//   res.json({
//     id: "mchang",
//     name: "Michael",
//     avatarURL: "images/stanford.png",
//     following: [],
//   });
// });

// Phương thức GET để lấy thông tin của một người dùng dựa vào ID
api.get("/users/:id", (req, res) => {
  const userId = req.params.id;

  // Tìm người dùng trong mảng users dựa trên userId
  const user = users.find((user) => user.id === userId);

  if (user) {
    // Nếu người dùng được tìm thấy, trả về thông tin của người dùng
    res.json({ user });
  } else {
    // Nếu không tìm thấy người dùng, trả về một lỗi 404 (Not Found)
    res.status(404).json({ error: "User not found" });
  }
});

const users = [];

// Phương thức POST để tạo một người dùng mới
api.post("/users", (req, res) => {
  const { id, name, avatarURL, following } = req.body;

  // Kiểm tra xem các trường thông tin cần thiết có được cung cấp hay không
  if (!id || !name || !avatarURL) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Kiểm tra xem người dùng đã tồn tại hay chưa
  const existingUser = users.find((user) => user.id === id);
  if (existingUser) {
    return res.status(400).json({ error: "User ID already exists" });
  }

  // Tạo một người dùng mới
  const newUser = {
    id,
    name,
    avatarURL,
    following,
  };

  // Thêm người dùng mới vào mảng users
  users.push(newUser);

  // Trả về phản hồi thành công và người dùng mới đã được tạo
  res.status(201).json({
    success: true,
    message: "User created successfully",
    user: newUser,
  });
});

const posts = [];

// GET: Lấy thông tin về các bài đăng của người dùng mchang
api.get("/users/mchang/posts", (req, res) => {
  // Giả sử 'posts' là một mảng chứa các bài đăng của người dùng mchang
  res.json({ posts: posts });
});

// POST: Thêm một bài đăng mới cho người dùng mchang
// Phương thức POST để thêm một bài đăng mới cho người dùng có ID là "mchang"
api.post("/users/mchang/posts", (req, res) => {
  const text = req.body.text;

  // Kiểm tra xem dữ liệu có hợp lệ không
  if (!text) {
    return res.status(400).json({ error: "Text for post is required" });
  }

  // Tạo một bài đăng mới
  const newPost = {
    user: {
      id: "mchang",
      name: "Michael",
      avatarURL: "images/stanford.png",
    },
    time: new Date(),
    text: text,
  };

  // Thêm bài đăng mới vào mảng posts
  posts.push(newPost);

  // Trả về phản hồi thành công và bài đăng mới được tạo
  res.status(201).json({
    success: true,
    message: "Post created successfully",
    post: newPost,
  });
});

/* This is a catch-all route that logs any requests that weren't handled above.
   Useful for seeing whether other requests are coming through correctly */
api.all("/*", (req, res) => {
  let data = {
    method: req.method,
    path: req.url,
    query: req.query,
    body: req.body,
  };
  console.log(data);
  res.status(500).json({ error: "Not implemented" });
});

export default initApi;
