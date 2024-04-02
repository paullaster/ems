import AuthService from "../../modules/auth/AuthService";

export default function user({ next, router }) {
  if (!AuthService.check()) {
    return router.push({ name: "Login" });
  } else if (AuthService.user["is_admin"]) {
    return router.replace({
      name: "AdminSettings",
    });
  }
  return next();
}
