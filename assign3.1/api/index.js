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

// Endpoint GET để lấy feed của người dùng
api.get("/users/:id/posts", (req, res) => {
  const userId = req.params.id; // Lấy ID của người dùng từ URL

  // Tìm kiếm người dùng với ID tương ứng trong danh sách users
  const userIndex = users.findIndex((user) => user.id === userId);

  // Nếu không tìm thấy người dùng, trả về mã lỗi 404 và thông báo lỗi
  if (userIndex === -1) {
    return res.status(404).json({ error: `No user with ID ${userId}` });
  }

  // Lấy danh sách người dùng mà người dùng hiện tại đang theo dõi
  const followingList = users[userIndex].following;

  // Tạo mảng để lưu trữ feed của người dùng
  let userFeed = [];

  // Thêm bài đăng của người dùng hiện tại vào feed
  userFeed.push(
    ...users[userIndex].posts.map((post) => ({
      user: {
        id: userId,
        name: users[userIndex].name,
        avatarURL: users[userIndex].avatarURL,
      },
      time: post.time,
      text: post.text,
    })),
  );

  // Lặp qua từng người dùng mà người dùng hiện tại đang theo dõi
  followingList.forEach((followingId) => {
    // Tìm kiếm người dùng được theo dõi trong danh sách users
    const followingUserIndex = users.findIndex(
      (user) => user.id === followingId,
    );
    // Nếu người dùng được theo dõi tồn tại
    if (followingUserIndex !== -1) {
      // Thêm các bài đăng của người dùng được theo dõi vào feed
      userFeed.push(
        ...users[followingUserIndex].posts.map((post) => ({
          user: {
            id: followingId,
            name: users[followingUserIndex].name,
            avatarURL: users[followingUserIndex].avatarURL,
          },
          time: post.time,
          text: post.text,
        })),
      );
    }
  });

  // Sắp xếp các bài đăng trong feed theo thời gian giảm dần (mới nhất trước)
  userFeed.sort((a, b) => new Date(b.time) - new Date(a.time));

  // Trả về feed của người dùng
  res.json({ posts: userFeed });
});

// Phương thức POST để tạo một bài đăng mới
api.post("/users/:id/posts", (req, res) => {
  const userId = req.params.id; // Lấy ID của người dùng từ URL
  const { text } = req.body; // Lấy nội dung bài viết từ body của yêu cầu

  // Kiểm tra xem nội dung bài viết đã được cung cấp hay không
  if (!text) {
    return res.status(400).json({ error: "Text property is missing or empty" });
  }

  // Tìm kiếm người dùng với ID tương ứng trong danh sách users
  const userIndex = users.findIndex((user) => user.id === userId);

  // Nếu không tìm thấy người dùng, trả về mã lỗi 404 và thông báo lỗi
  if (userIndex === -1) {
    return res.status(404).json({ error: `No user with ID ${userId}` });
  }

  // Kiểm tra xem mảng `posts` của người dùng đã được khởi tạo chưa
  if (!users[userIndex].posts) {
    // Nếu chưa, khởi tạo mảng `posts`
    users[userIndex].posts = [];
  }

  // Tạo một bài đăng mới
  const newPost = {
    user: {
      id: userId,
      name: users[userIndex].name, // Lấy tên người dùng từ danh sách users
      avatarURL: users[userIndex].avatarURL, // Lấy URL avatar của người dùng từ danh sách users
    },
    time: new Date(), // Thời gian hiện tại
    text: text,
  };

  // Thêm bài đăng mới vào mảng posts của người dùng
  users[userIndex].posts.push(newPost);

  // Trả về phản hồi thành công
  res.status(200).json({ success: true });
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

// Phương thức DELETE để ngừng theo dõi người dùng mục tiêu
api.delete("/users/:id/follow", (req, res) => {
  const userId = req.params.id; // Lấy ID của người dùng từ URL
  const targetId = req.query.target; // Lấy ID của người dùng mục tiêu từ query string

  // Kiểm tra xem query string có chứa thuộc tính target hay không
  if (!targetId) {
    return res
      .status(400)
      .json({ error: "Query string is missing a target property" });
  }

  // Tìm kiếm người dùng với ID tương ứng trong danh sách users
  const userIndex = users.findIndex((user) => user.id === userId);

  // Nếu không tìm thấy người dùng, trả về mã lỗi 404 và thông báo lỗi
  if (userIndex === -1) {
    return res.status(404).json({ error: `No user with ID ${userId}` });
  }

  // Tìm kiếm người dùng mục tiêu trong danh sách users
  const targetUserIndex = users.findIndex((user) => user.id === targetId);

  // Nếu không tìm thấy người dùng mục tiêu, trả về mã lỗi 404 và thông báo lỗi
  if (targetUserIndex === -1) {
    return res.status(404).json({ error: `No user with ID ${targetId}` });
  }

  // Kiểm tra xem người dùng đang theo dõi người dùng mục tiêu không
  const isFollowing = users[userIndex].following.includes(targetId);

  // Nếu người dùng không theo dõi người dùng mục tiêu, trả về mã lỗi 400 và thông báo lỗi
  if (!isFollowing) {
    return res
      .status(400)
      .json({ error: `${userId} is not following ${targetId}` });
  }

  // Xóa người dùng mục tiêu khỏi danh sách người dùng đang theo dõi của người dùng
  users[userIndex].following = users[userIndex].following.filter(
    (id) => id !== targetId,
  );

  // Trả về phản hồi thành công
  res.status(200).json({ success: true });
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
