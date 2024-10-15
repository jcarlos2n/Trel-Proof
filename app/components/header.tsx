import { Link } from "@remix-run/react";


export default function Header() {
    return (
        <div className="lg:flex lg:items-center items-center p-5 bg-slate-900">
            <div className="min-w-0 flex-1">
                <Link
                    to="/"
                    className="text-xl font-medium text-brand-aqua underline"
                >
                    <h2 className="text-2xl font-bold leading-7 text-brand-aqua sm:truncate sm:text-3xl sm:tracking-tight">
                        TREL-PROOF
                    </h2>
                </Link>

            </div>
        </div>
    )
}
