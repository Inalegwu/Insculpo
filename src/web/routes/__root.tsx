import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Layout } from "../components";

export const Route = createRootRoute({
  component: () => (
    <Layout>
      {/* <Settings /> */}
      <Outlet />
    </Layout>
  ),
});
