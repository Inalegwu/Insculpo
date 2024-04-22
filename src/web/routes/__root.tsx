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
            "bg-indigo-500/30 text-indigo-500 text-[11px] shadow-lg dark:bg-slate-700 dark:text-gray-300",
        }}
        reverseOrder
      />
    </Layout>
  ),
});
