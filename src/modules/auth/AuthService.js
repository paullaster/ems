class AuthService {
  constructor() {
    this.token = window.localStorage.getItem("aquila_token");
    this.user = JSON.parse(window.localStorage.getItem("aquila_user"));
  }

  check() {
    return !!this.token;
  }

  setUser(user) {
    window.localStorage.setItem("aquila_user", JSON.stringify(user));
    this.user = user;
  }

  login(token, user) {
    window.localStorage.setItem("aquila_token", token);
    window.localStorage.setItem("aquila_user", JSON.stringify(user));
    this.token = token;
    this.user = user;
    location.reload();
  }

  logout() {
    window.localStorage.removeItem("aquila_token");
    window.localStorage.removeItem("aquila_user");
    location.reload();
  }
}

export default new AuthService();
