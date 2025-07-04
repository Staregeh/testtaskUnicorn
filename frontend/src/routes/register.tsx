import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { api } from "@/lib/api";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await api<{ token: string }>("/auth/register", {
          method: "POST",
          body: JSON.stringify(value),
        });
        navigate({ to: "/login" });
      } catch (err: any) {
        const errorMessage =
          err.message && err.message.toLowerCase().includes("unauthorized")
            ? "Wrong username or password."
            : err.message || "Registration failed. Please try again.";

        form.setErrorMap({
          onSubmit: errorMessage,
        });
      }
    },
  });

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col gap-4"
      >
        <form.Subscribe selector={(state) => [state.errorMap]}>
          {([errorMap]) =>
            errorMap?.onSubmit ? (
              <div className="text-red-500 text-sm mb-2">
                {errorMap.onSubmit}
              </div>
            ) : null
          }
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
        <form.Field name="email">
          {(field) => (
            <Input
              type="email"
              placeholder="Email"
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
          {form.state.isSubmitting ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
}
