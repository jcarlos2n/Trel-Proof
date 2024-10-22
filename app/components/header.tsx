import { Link } from "@remix-run/react";


export default function Header({ loggedIn }: { loggedIn: boolean }) {

  return (

    <div className="lg:flex lg:items-center items-center p-5 bg-slate-900">
      <div className="min-w-0 flex-1">
        <Link
          to={loggedIn ? "/home" : "/"}
          className="text-xl font-medium text-brand-aqua underline"
        >
          <h2 className="text-2xl font-bold leading-7 text-brand-aqua sm:truncate sm:text-3xl sm:tracking-tight">
            TREL-PROOF
          </h2>
        </Link>
      </div>

      {loggedIn ? (
        <div className="flex space-x-4">
          <Link to="/logout" className="text-white font-medium">
            Log-Out
          </Link>
        </div>
      ) : (
        <Link to="/login" className="text-white font-medium">
          Login
        </Link>
      )}
    </div>
  );
}