import apiRequest from "./apirequest.js";
import FollowList from "./followlist.js";
import User, { Post } from "./user.js";

export default class App {
  constructor() {
    /* Store the currently logged-in user. */
    this._user = null;

    this._onListUsers = this._onListUsers.bind(this);
    this._onLogin = this._onLogin.bind(this);
    this._loginForm = document.querySelector("#loginForm");
    this._loginForm.listUsers.addEventListener("click", this._onListUsers);
    this._loginForm.login.addEventListener("click", this._onLogin);
    //TODO: Initialize any additional private variables/handlers, and set up the FollowList
    this._postForm = document.querySelector("#postForm");
    this._onPost = this._onPost.bind(this);
    this._postForm
      .querySelector("#postButton")
      .addEventListener("click", this._onPost);
    this._onAddFollower = this._onAddFollower.bind(this);
    this._onRemoveFollower = this._onRemoveFollower.bind(this);
    this._followList = new FollowList(
      document.querySelector("#followContainer"),
      this._onAddFollower,
      this._onRemoveFollower,
    );

    this._onAvatarSubmit = this._onAvatarSubmit.bind(this);
    this._onNameSubmit = this._onNameSubmit.bind(this);
  }

  /*** Event handlers ***/

  async _onListUsers() {
    let users = await User.listUsers();
    let usersStr = users.join("\n");
    alert(`List of users:\n\n${usersStr}`);
  }

  //TODO: Add your event handlers/callback functions here
  async _onLogin(event) {
    event.preventDefault(); // ngăn chặn việc reload lại trang sau khi đăng nhập
    this._user = await User.loadOrCreate(this._loginForm.userid.value);
    await this._loadProfile();
    let postArray = await this._user.getFeed();
    for (let i of postArray) {
      this._displayPost(i);
    }
  }

  async _onPost(event) {
    event.preventDefault();
    await this._user.makePost(this._postForm.querySelector("#newPost").value);
    await this._loadProfile();
    let postArray = await this._user.getFeed();
    for (let i of postArray) {
      this._displayPost(i);
    }
  }
  //TODO: Add your event handlers/callback functions here
  async _onRemoveFollower(id) {
    await this._user.deleteFollow(id);
    await this._loadProfile();
    let postArray = await this._user.getFeed();
    for (let i of postArray) {
      this._displayPost(i);
    }
  }

  async _onAddFollower(id) {
    await this._user.addFollow(id);
    await this._loadProfile();
    let postArray = await this._user.getFeed();
    for (let i of postArray) {
      this._displayPost(i);
    }
  }

  async _onNameSubmit(event) {
    event.preventDefault();
    this._user.name = document.querySelector("#nameInput").value;
    await this._user.save();
    await this._loadProfile();
    let postArray = await this._user.getFeed();
    for (let i of postArray) {
      this._displayPost(i);
    }
  }

  async _onAvatarSubmit(event) {
    event.preventDefault();
    this._user.avatarURL = document.querySelector("#avatarInput").value;
    await this._user.save();
    await this._loadProfile();
    let postArray = await this._user.getFeed();
    for (let i of postArray) {
      this._displayPost(i);
    }
  }

  /*** Helper methods ***/

  /* Add the given Post object to the feed. */
  _displayPost(post) {
    /* Make sure we receive a Post object. */
    if (!(post instanceof Post)) {
      throw new Error("displayPost wasn't passed a Post object");
    }

    let elem = document.querySelector("#templatePost").cloneNode(true);
    elem.id = "";

    let avatar = elem.querySelector(".avatar");
    avatar.src = post.user.avatarURL;
    avatar.alt = `${post.user}'s avatar`;

    elem.querySelector(".name").textContent = post.user;
    elem.querySelector(".userid").textContent = post.user.id;
    elem.querySelector(".time").textContent = post.time.toLocaleString();
    elem.querySelector(".text").textContent = post.text;

    document.querySelector("#feed").append(elem);
  }

  /* Load (or reload) a user's profile. Assumes that this._user has been set to a User instance. */
  async _loadProfile() {
    document.querySelector("#welcome").classList.add("hidden");
    document.querySelector("#main").classList.remove("hidden");
    document.querySelector("#idContainer").textContent = this._user.id;
    /* Reset the feed. */
    document.querySelector("#feed").textContent = "";

    /* Update the avatar, name, and user ID in the new post form */
    this._postForm.querySelector(".avatar").src = this._user.avatarURL;
    this._postForm.querySelector(".name").textContent = this._user;
    this._postForm.querySelector(".userid").textContent = this._user.id;

    //TODO: Update the rest of the sidebar and show the user's feed
    document.querySelector("#nameInput").value = this._user.name;
    document.querySelector("#avatarInput").value = this._user.avatarURL;
    document
      .querySelector("#nameSubmit")
      .addEventListener("click", this._onNameSubmit);
    document
      .querySelector("#avatarSubmit")
      .addEventListener("click", this._onAvatarSubmit);
    this._followList.setList(this._user.following);
  }
}
