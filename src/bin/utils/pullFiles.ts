import { RepoInit, TermLogger } from "/lib/Helpers";
import type { NS }              from "Bitburner";

export async function main(ns: NS) {
    const logger   = new TermLogger(ns);
    const initRepo = new RepoInit(ns, logger);

    await initRepo.downloadAllFiles();
}