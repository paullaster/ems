import { appName } from "../../environment/environment";

class AuthService {
  constructor() {
    this.token = window.localStorage.getItem(`${appName}_token`);
    this.user = JSON.parse(window.localStorage.getItem(`${appName}_user`));
  }

  check() {
    return !!this.token;
  }

  setUser(user) {
    window.localStorage.setItem(`${appName}_user`, JSON.stringify(user));
    this.user = user;
  }

  login(token, user) {
    window.localStorage.setItem(`${appName}_token`, token);
    window.localStorage.setItem(`${appName}_user`, JSON.stringify(user));
    this.token = token;
    this.user = user;
    // location.reload();
  }

  logout() {
    window.localStorage.removeItem(`${appName}_token`);
    window.localStorage.removeItem(`${appName}_user`);
    location.reload();
  }
}

export default new AuthService();
