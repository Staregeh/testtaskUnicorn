import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export default function Layout() {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-white shadow">
        <nav className="container mx-auto flex gap-4 py-4 items-center">
          <Link to="/" className="font-bold">
            Home
          </Link>
          {!isAuthenticated && <Link to="/login">Login</Link>}
          {!isAuthenticated && <Link to="/register">Register</Link>}
          <Link to="/repository">Repositories</Link>
          <div className="flex-1" />
          {isAuthenticated && (
            <div className="flex items-center gap-4">
              {username && <span>Hello, {username}</span>}
              <button onClick={handleLogout} className="text-red-600">
                Logout
              </button>
            </div>
          )}
        </nav>
      </header>
      <main className="flex-1 container mx-auto py-8">
        <Outlet />
      </main>
    </div>
  );
}
