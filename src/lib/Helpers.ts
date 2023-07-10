import { Constants } from "/lib/Constants";
import { NS }        from "Bitburner";
import Colors = Constants.Colors;
import Home = Constants.Home;
import LogLevel = Constants.LogLevel;

const ReadText = {
    readLines(ns: NS, file: string): string[] {
        return (ns.read(file) as string).split(/\r\n|\r|\n/g);
    },

    readNonEmptyLines(ns: NS, file: string): string[] {
        return ReadText.readLines(ns, file).filter(
            (x) => x.trim() != ""
        );
    }
};

const DownloadFiles = {
    async getFileToHome(ns: NS, source: string, dest: string) {
        const logger = new TermLogger(ns);

        logger.info(`Downloading ${source.white()} -> ${dest.white()}`);

        if (!(await ns.wget(source, dest, Home))) {
            logger.err(`\tFailed retrieving ${source.white()} -> ${dest.white()}`);
        }
    }
};

const BasicSecurity = {
    maxSecurityLevel(ns: NS): number {
        return (
            +ns.fileExists(
                Constants.PurchasableProgram.BruteSSH,
                Home
            ) +
            +ns.fileExists(
                Constants.PurchasableProgram.FTPCrack,
                Home
            ) +
            +ns.fileExists(
                Constants.PurchasableProgram.RelaySMTP,
                Home
            ) +
            +ns.fileExists(
                Constants.PurchasableProgram.HTTPWorm,
                Home
            ) +
            +ns.fileExists(
                Constants.PurchasableProgram.SQLInject,
                Home
            )
        );
    },
    break(ns: NS, target: string, level: number) {
        if (level > 4) BasicSecurity.breakSQL(ns, target);
        if (level > 3) BasicSecurity.breakHTTP(ns, target);
        if (level > 2) BasicSecurity.breakSMTP(ns, target);
        if (level > 1) BasicSecurity.breakFTP(ns, target);
        if (level > 0) BasicSecurity.breakSSH(ns, target);

        ns.nuke(target);
    },
    breakSSH(ns: NS, target: string) {
        ns.brutessh(target);
    },
    breakFTP(ns: NS, target: string) {
        ns.ftpcrack(target);
    },
    breakSMTP(ns: NS, target: string) {
        ns.relaysmtp(target);
    },
    breakHTTP(ns: NS, target: string) {
        ns.httpworm(target);
    },
    breakSQL(ns: NS, target: string) {
        ns.sqlinject(target);
    }
};

class TermLogger {
    readonly ns: NS;

    constructor(ns: NS) {
        this.ns = ns;
    }

    info(msg: string, ...args: string[]) {
        this.ns.tprintf(`${LogLevel.INFO} ${msg}`, ...args);
    }

    warn(msg: string, ...args: string[]) {
        this.ns.tprintf(`${LogLevel.WARN} ${msg}`, ...args);
    }

    err(msg: string, ...args: string[]) {
        this.ns.tprintf(`${LogLevel.ERROR} ${msg}`, ...args);
    }

    log(msg: string, ...args: string[]) {
        this.ns.tprintf(`${LogLevel.TRACE} ${msg}`, ...args);
    }
}

interface RepoSettings {
    readonly baseUrl: string;
    readonly manifestPath: string;
}

const repoSettings: RepoSettings = {
    baseUrl: "http://localhost:9182",
    manifestPath: "/resources/manifest.txt"
};

class RepoInit {
    readonly ns: NS;
    readonly logger: TermLogger;

    constructor(ns: NS, logger: TermLogger) {
        this.ns     = ns;
        this.logger = logger;
    }

    private static getSourceDestPair(line: string): { source: string; dest: string } | null {
        return line.startsWith("./")
               ? {
                source: `${repoSettings.baseUrl}${line.substring(1)}`,
                dest: line.substring(1)
            }
               : null;
    }

    async downloadAllFiles() {
        await this.getManifest();

        const files = ReadText.readNonEmptyLines(
            this.ns,
            repoSettings.manifestPath
        );

        this.logger.info(`Contents of manifest:`);
        this.logger.info(`\t${files.join("\n")}`);

        for (let file of files) {
            const pair = RepoInit.getSourceDestPair(file);

            if (!pair) {
                this.logger.err(`Could not read line ${file.white()}`);
            } else {
                await DownloadFiles.getFileToHome(this.ns, pair.source, pair.dest);
            }
        }
    }

    private async getManifest() {
        const manifestUrl = `${repoSettings.baseUrl}${repoSettings.manifestPath}`;

        this.logger.info(`Getting manifest...`);

        await DownloadFiles.getFileToHome(
            this.ns,
            manifestUrl,
            repoSettings.manifestPath
        );
    }
}

declare global {
    interface String {
        black(): string;

        red(): string;

        green(): string;

        yellow(): string;

        blue(): string;

        magenta(): string;

        cyan(): string;

        white(): string;

        brightBlack(): string;

        brightRed(): string;

        brightGreen(): string;

        brightYellow(): string;

        brightBlue(): string;

        brightMagenta(): string;

        brightCyan(): string;

        brightWhite(): string;

        default(): string;
    }
}

String.prototype.black = function () {
    return `${Colors.black}${this}${Colors.default}`;
};

String.prototype.red = function () {
    return `${Colors.red}${this}${Colors.default}`;
};

String.prototype.green = function () {
    return `${Colors.green}${this}${Colors.default}`;
};

String.prototype.yellow = function () {
    return `${Colors.yellow}${this}${Colors.default}`;
};

String.prototype.blue = function () {
    return `${Colors.blue}${this}${Colors.default}`;
};

String.prototype.magenta = function () {
    return `${Colors.magenta}${this}${Colors.default}`;
};

String.prototype.cyan = function () {
    return `${Colors.cyan}${this}${Colors.default}`;
};

String.prototype.white = function () {
    return `${Colors.white}${this}${Colors.default}`;
};

String.prototype.brightBlack = function () {
    return `${Colors.brightBlack}${this}${Colors.default}`;
};

String.prototype.brightRed = function () {
    return `${Colors.brightRed}${this}${Colors.default}`;
};

String.prototype.brightGreen = function () {
    return `${Colors.brightGreen}${this}${Colors.default}`;
};

String.prototype.brightYellow = function () {
    return `${Colors.brightYellow}${this}${Colors.default}`;
};

String.prototype.brightBlue = function () {
    return `${Colors.brightBlue}${this}${Colors.default}`;
};

String.prototype.brightMagenta = function () {
    return `${Colors.brightMagenta}${this}${Colors.default}`;
};

String.prototype.brightCyan = function () {
    return `${Colors.brightCyan}${this}${Colors.default}`;
};

String.prototype.brightWhite = function () {
    return `${Colors.brightWhite}${this}${Colors.default}`;
};

String.prototype.default = function () {
    return `${Colors.default}${this}${Colors.default}`;
};

export { ReadText, TermLogger, RepoInit, DownloadFiles, BasicSecurity };