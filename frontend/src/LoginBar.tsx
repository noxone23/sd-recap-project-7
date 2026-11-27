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
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <div>
        <button onClick={login}>Log in with GitHub</button>
      </div>
    );
  }

  return (
    <div>
      <img src={session.user.image ?? ""} alt="" width="40" height="40" />
      <span>{session.user.name}</span>
      <button onClick={logout}>Log out</button>
    </div>
  );
}