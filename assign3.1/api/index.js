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

// Phương thức GET để lấy danh sách tất cả ID của người dùng
api.get("/users", (req, res) => {
  // Lặp qua danh sách các người dùng và tạo một mảng mới chỉ chứa các ID của họ
  const userIds = users.map((user) => user.id);

  // Trả về danh sách ID của tất cả người dùng dưới dạng JSON
  res.json({ users: userIds });
});

// api.get("/users/mchang", (req, res) => {
//   res.json({
//     id: "mchang",
//     name: "Michael",
//     avatarURL: "images/stanford.png",
//     following: [],
//   });
// });

// Tạo một phương thức GET để lấy hồ sơ của một người dùng dựa trên ID
api.get("/users/:id", (req, res) => {
  const userId = req.params.id; // Lấy ID của người dùng từ URL

  // Tìm kiếm người dùng với ID tương ứng trong danh sách users
  const user = users.find((user) => user.id === userId);

  // Nếu không tìm thấy người dùng, trả về mã lỗi 404 và thông báo lỗi
  if (!user) {
    return res.status(404).json({ error: `No user with ID ${userId}` });
  }

  // Nếu tìm thấy người dùng, trả về thông tin của người dùng
  res.json({
    id: user.id,
    name: user.name,
    avatarURL: user.avatarURL,
    following: user.following,
  });
});

// Là một mảng lưu trữ thông tin của tất cả người dùng
const users = [];

// Hàm để tìm kiếm người dùng theo ID
const getUserById = (userId) => {
  return users.find((user) => user.id === userId);
};

api.post("/users", (req, res) => {
  // Kiểm tra xem request body có thuộc tính "id" không và giá trị của "id" không rỗng
  if (!req.body.id || req.body.id.trim() === "") {
    return res.status(400).json({ error: "ID is missing or empty" });
  }

  // Trích xuất thông tin về người dùng từ dữ liệu gửi từ phía client
  const userId = req.body.id;
  const userName = req.body.name;
  const userAvatar = req.body.avatarURL;
  const userFollowing = req.body.following;

  // Kiểm tra xem người dùng đã tồn tại chưa
  if (getUserById(userId)) {
    return res.status(400).json({ error: "User already exists" });
  }

  // Tạo một người dùng mới
  const newUser = {
    id: userId,
    name: userName,
    avatarURL: userAvatar || "images/default.png", // Sử dụng ảnh mặc định nếu không có URL ảnh được cung cấp
    following: userFollowing || [], // Sử dụng mảng trống nếu không có người dùng được theo dõi
  };

  // Thêm người dùng mới vào danh sách người dùng
  users.push(newUser);

  // Trả về dữ liệu của người dùng mới tạo
  res.status(200).json(newUser);
});

// GET: Lấy thông tin về các bài đăng của người dùng với ID
api.get("/users/:id/posts", (req, res) => {
  // Trả về danh sách các bài đăng từ những người mà người dùng đang theo dõi
  res.json({ posts: posts });
});

const posts = [];

// Phương thức POST để thêm một bài đăng mới cho người dùng với ID
api.post("/users/:id/posts", (req, res) => {
  const userId = req.params.id;
  const { text } = req.body; // Lấy nội dung bài viết từ body của yêu cầu

  // Kiểm tra xem nội dung bài viết đã được cung cấp hay không
  if (!text) {
    return res.status(400).json({ error: "Text property is missing or empty" });
  }

  // Tìm kiếm người dùng với ID tương ứng trong danh sách users
  const user = users.find((user) => user.id === userId);

  // Nếu không tìm thấy người dùng, trả về mã lỗi 404 và thông báo lỗi
  if (user === -1) {
    return res.status(404).json({ error: `No user with ID ${userId}` });
  }

  // Tạo một bài đăng mới
  const newPost = {
    user: {
      id: user.id,
      name: user.name,
      avatarURL: user.avatarURL,
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

// Endpoint POST để người dùng theo dõi người dùng mục tiêu
api.post("/users/:id/follow", (req, res) => {
  const userId = req.params.id; // Lấy ID của người dùng từ URL
  const targetId = req.query.target; // Lấy ID của người dùng mục tiêu từ query string

  // Kiểm tra xem targetId đã được cung cấp hay không
  if (!targetId) {
    return res
      .status(400)
      .json({ error: "Target property is missing or empty" });
  }

  // Tìm kiếm người dùng và người dùng mục tiêu trong danh sách users
  const user = users.find((user) => user.id === userId);
  const targetUser = users.find((user) => user.id === targetId);

  // Nếu không tìm thấy người dùng hoặc người dùng mục tiêu, trả về mã lỗi 404 và thông báo lỗi
  if (!user || !targetUser) {
    return res
      .status(404)
      .json({ error: "Either user id or target does not exist" });
  }

  // Kiểm tra xem người dùng đã theo dõi người dùng mục tiêu chưa
  if (user.following.includes(targetId)) {
    return res
      .status(400)
      .json({ error: `${userId} is already following ${targetId}` });
  }

  // Kiểm tra xem người dùng có phải là chính mình không
  if (userId === targetId) {
    return res
      .status(400)
      .json({ error: "Requesting user cannot follow themselves" });
  }

  // Thêm ID của người dùng mục tiêu vào danh sách theo dõi của người dùng
  user.following.push(targetId);

  // Trả về phản hồi thành công
  res.json({ success: true });
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
