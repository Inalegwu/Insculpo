import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";
import { Layout } from "../components";

export const Route = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
      <Toaster
        position="bottom-right"
        toastOptions={{
          className:
            "bg-slate-50 text-[11px] shadow-lg dark:bg-dark-8 dark:text-gray-400",
        }}
        reverseOrder
      />
    </Layout>
  ),
});
