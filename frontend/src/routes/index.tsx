import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const { isAuthenticated } = useAuth();
  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] text-center gap-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to Repositories
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
          Effortlessly manage and track your favorite repositories. Secure,
          simple, and fast.
        </p>
      </div>
      <div className="flex gap-4 justify-center">
        {isAuthenticated ? (
          <Button asChild>
            <a href="/repository">Go to Repositories</a>
          </Button>
        ) : (
          <>
            <Button asChild>
              <a href="/login">Login</a>
            </Button>
            <Button asChild variant="secondary">
              <a href="/register">Register</a>
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
