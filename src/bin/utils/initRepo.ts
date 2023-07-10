import { NS } from "Bitburner";

const params = {
    baseUrl: "http://localhost:9182/",
    manifest: {
        sourceFile: "resources/manifest.txt",
        destFile: "/resources/manifest.txt"
    },
    helpers: {
        sourceFile: "lib/Helpers.js",
        destFile: "/lib/Helpers.js"
    },
    constants: {
        sourceFile: "lib/Constants.js",
        destFile: "/lib/Constants.js"
    },
    pullFiles: {
        sourceFile: "bin/utils/pullFiles.js",
        destFile: "/bin/utils/pullFiles.js"
    }
};

async function pullFile(
    ns: NS,
    file: { sourceFile: string; destFile: string }
) {
    const sourceUrl = `${params.baseUrl}${file.sourceFile}`;

    ns.tprintf(
        `INFO\t> Downloading ${sourceUrl} -> ${file.destFile}`
    );

    if (!(await ns.wget(sourceUrl, file.destFile, "home"))) {
        ns.tprintf(`ERROR\t> ${sourceUrl} -> ${file.destFile} failed.`);
        ns.exit();
    }
}

/** @param {NS} ns **/
export async function main(ns: NS) {
    const files = [params.helpers, params.manifest, params.constants, params.pullFiles];

    for (let file of files) {
        await pullFile(ns, file);
    }

    ns.tprintf(`INFO\t> Successfully pulled initial files!`);
    ns.tprintf(`INFO\t> Running download script...`);

    await ns.sleep(250);

    ns.run(params.pullFiles.destFile);
}