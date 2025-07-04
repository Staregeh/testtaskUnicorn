import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { redirectTo?: string };
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await api<{ access_token: string }>("/auth/login", {
          method: "POST",
          body: JSON.stringify(value),
        });
        login(res.access_token, value.username);
        navigate({ to: search.redirectTo || "/repository" });
      } catch (err: any) {
        const errorMessage =
          err.message && err.message.toLowerCase().includes("unauthorized")
            ? "Wrong username or password."
            : err.message || "Login failed. Please try again.";

        form.setErrorMap({
          onSubmit: errorMessage,
        });
      }
    },
  });

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await form.handleSubmit(e);
        }}
        className="flex flex-col gap-4"
      >
        <form.Subscribe selector={(state) => [state.errorMap]}>
          {([errorMap]) => {
            return errorMap?.onSubmit ? (
              <div className="text-red-500 text-sm mb-2">
                {errorMap.onSubmit}
              </div>
            ) : null;
          }}
        </form.Subscribe>

        <form.Field name="username">
          {(field) => (
            <Input
              type="text"
              placeholder="Username"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              required
            />
          )}
        </form.Field>
        <form.Field name="password">
          {(field) => (
            <Input
              type="password"
              placeholder="Password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              required
            />
          )}
        </form.Field>
        <Button
          type="submit"
          disabled={form.state.isSubmitting}
          className="w-full"
        >
          {form.state.isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
