import { createRootRoute } from "@tanstack/react-router";

import Layout from "../components/Layout";
import { AuthProvider } from "../lib/auth";

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  ),
});
