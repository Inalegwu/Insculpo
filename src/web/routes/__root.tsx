import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";
import { Layout } from "../components";

export const Route = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
      <Toaster
        position="bottom-left"
        containerStyle={{ fontSize: 12 }}
        reverseOrder
      />
    </Layout>
  ),
});
