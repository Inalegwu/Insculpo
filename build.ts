import { Console, Data, Effect } from "effect";
import { build } from "electron-builder";
import * as pkg from "./package.json";

class BuildError extends Data.TaggedError("electron-build-error")<{
    cause: unknown;
}> {}

const buildStep = () =>
    build({
        config: {
            "appId": "com.insculpo.app",
            "productName": "Insculpo",
            "artifactName":
                "${productName}-${version}_${platform}_${arch}-Setup.${ext}",
            "buildDependenciesFromSource": true,
            "icon": "assets/icon.png",
            "files": [
                "out/**/*",
            ],
            "directories": {
                "output": "release/${version}",
            },
            "mac": {
                "target": [
                    "dmg",
                    "zip",
                ],
            },
            "win": {
                "target": [
                    {
                        "target": "nsis",
                        "arch": [
                            "x64",
                        ],
                    },
                ],
            },
            "linux": {
                "target": [
                    "AppImage",
                    "deb",
                ],
            },
            "nsis": {
                "oneClick": false,
                "allowToChangeInstallationDirectory": true,
            },
        },
    });

const runBuild = Effect.gen(function* () {
    yield* Effect.logInfo(`Attempting to build ${pkg.name}`);

    yield* Effect.tryPromise({
        try: async () =>
            await buildStep().then((response) =>
                Console.log(response.join("\n"))
            ),
        catch: (cause) => new BuildError({ cause }),
    });
}).pipe(
    Effect.scoped,
    Effect.catchAll((e) => Effect.logFatal(`${e.message}:${e.cause}`)),
    Effect.annotateLogs({
        step: "build",
    }),
);

Effect.runFork(runBuild);
