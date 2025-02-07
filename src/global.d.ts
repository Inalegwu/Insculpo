declare global {
    export type GlobalState = {
        colorMode: "dark" | "light";
        firstLaunch: boolean;
        editorState: "writing" | "viewing";
        appId: string | null;
        route: "Notes" | "Notebooks";
    };

    export type Tag = {
        title?: string;
        description?: string;
        url?: string;
        site_name?: string;
        image?: string;
        icon?: string;
        keywords?: string | string[];
    };

    export type Note = {
        title: string;
        subtitle: string;
        body: string;
    };
}

export type {};
