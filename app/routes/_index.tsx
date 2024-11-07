import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, redirect } from "@remix-run/react";
import { requireAuthCookie } from "~/auth/auth";

export const meta: MetaFunction = () => {
  return [
    { title: "Trel-Proof" },
    { name: "description", content: "Welcome to Trel-Proof!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  let userId = await requireAuthCookie(request);
  if (userId) {
    return redirect("/home")
  }
  return null
}

export default function Index() {
  return (
    <div className="h-full flex flex-col justify-center items-center m-5 bg-indigo-900">
      <div className="space-y-4 max-w-md text-lg text-slate-300">
        <p>
          Esto es una versión de prueba de Trel-Proof! Inspirada en Trello.
        </p>
      </div>
      <div className="flex w-full justify-evenly max-w-md mt-8 rounded-3xl p-10 bg-slate-700">
        <Link
          to="/signup"
          className="text-xl font-medium text-brand-aqua"
        >
          Sign up
        </Link>
        <div className="h-full border-r border-slate-500" />
        <Link
          to="/login"
          className="text-xl font-medium text-brand-aqua"
        >
          Login
        </Link>
      </div>
    </div>
  );
}