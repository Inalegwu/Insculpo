import { Show } from "@legendapp/state/react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Layout } from "../components";
import Settings from "../components/Settings";
import { globalState$ } from "../state";

export const Route = createRootRoute({
  component: () => (
    <Layout>
      <Show if={globalState$.settingsVisible}>
        <Settings />
      </Show>
      <Outlet />
    </Layout>
  ),
});
