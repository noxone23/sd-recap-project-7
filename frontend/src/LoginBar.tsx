import { authClient } from "./auth-client";

export function LoginBar() {
    const { data: session, isPending } = authClient.useSession();

    function login() {
        authClient.signIn.social({ provider: "github", callbackURL: "/" });
    }
      function logout() {
    authClient.signOut();
  }

  if (isPending) {
    return <div className="login-bar login-bar-loading">Loading…</div>
  }

  if (!session) {
    return (
      <div className="login-bar login-bar-out">
        <button type="button" className="login-button" onClick={login}>
          Log in with GitHub
        </button>
      </div>
    );
  }

  return (
    <div className="login-bar">
      <img className="avatar" src={session.user.image ?? ""} alt="" width="36" height="36" />
      <span className="login-name">{session.user.name}</span>
      <button type="button" onClick={logout}>Log out</button>
    </div>
  );
}