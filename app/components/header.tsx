import { Link, useSubmit } from "@remix-run/react";

export default function Header({ loggedIn }: { loggedIn: boolean }) {
  const submit = useSubmit();

  const handleLogout = () => {
    const formData = new FormData();
    formData.set("intent", "logout");

    submit(formData, { method: "post", action: "/logOut" });
  };

  return (
    <div className="lg:flex lg:items-center items-center p-5 bg-indigo-400">
      <div className="min-w-0 flex-1">
        <Link
          to={loggedIn ? "/home" : "/"}
          className="text-xl font-medium text-brand-aqua"
        >
          <h2 className="text-2xl font-bold leading-7 text-brand-aqua sm:truncate sm:text-3xl sm:tracking-tight">
            TREL-PROOF
          </h2>
        </Link>
      </div>

      {loggedIn ? (
        <div className="flex space-x-4">
          <button
            onClick={handleLogout}
            className="text-white font-medium"
          >
            Log-Out
          </button>
        </div>
      ) : (
        <Link to="/login" className="text-white font-medium">
          Login
        </Link>
      )}
    </div>
  );
}
