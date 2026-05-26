import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

const NotFound = () => (
  <main className="grid min-h-screen place-items-center bg-black p-6 text-center text-white">
    <div>
      <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">404</p>
      <h1 className="mt-4 text-4xl font-semibold">Page not found</h1>
      <p className="mt-3 text-zinc-400">The route you opened is not part of this workspace.</p>
      <Link className="mt-6 inline-block" to="/dashboard">
        <Button>Return to dashboard</Button>
      </Link>
    </div>
  </main>
);

export default NotFound;
