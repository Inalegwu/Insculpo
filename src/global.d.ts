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

    export type SignalNote = Note & {
        id: string;
    };

    export type Notebook = {
        id: string;
        name: string;
        notes: string[];
    };

    export type Course = {
        courseCode: string;
        courseName: string;
        courseTutors: string[];
    };

    export type Class = {
        id: string;
        name: string;
        course: Course;
        tutor: {
            name: string;
        };
        faculty: {
            name: string;
        };
    };
}

export type {};
