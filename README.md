# BitBurner TypeScript template repo

This is a starter repo for anyone wanting to use TypeScript to play
BitBurner!

The template relies on a number of things that you can probably change
to your liking; just be aware you might need to fiddle with settings if
you change them.

# Usage

## Requirements

- `npm`: The Node Package Manager
  - It's recommended to use a version manager like
    [nvm](https://github.com/nvm-sh/nvm#about)
  - Alternatively, you can just use
    [Node](https://nodejs.org/en/download/)
- A `bash`-capable environment. This has been tested on `debian`, `WSL`,
  and `git-bash`
- `tsc`: The
  [TypeScript compiler](https://www.typescriptlang.org/download)

## Quickstart

- In `Git Bash` or `bash`
  - clone / fork the repo. You can also click Use as template in
    GitHub to create a repo from this one
  - run `npm install`
  - run `npm run build`
  - run `npm run webserver`
- Go to the game
  - `wget http://localhost:9182/bin/utils/initRepo.ns
    /bin/utils/initRepo.ns`
  - `run /bin/utils/initRepo.ns`
  - `run /bin/sayHelloTs.ns`

If you see the colored output until the fake error, you should be good
to go :)

After the first pull, I usually make an alias
`alias pull="run /bin/utils/pullFiles.ns"` to make things more
convenient.

You can leave the server running and just `npm run re` to clean
rebuild the whole project, then use the `pull` alias in-game
whenever you want to update your scripts.

# Description

A short description of the most important parts of the template.

## package.json

```json
{
  "scripts": {
    "build": "npm-run-all buildTs copyResources buildNS buildManifest",
    "buildTs": "tsc -p tsconfig.json",
    "buildNS": "bin/buildNS.bash",
    "buildManifest": "bin/generateManifest.bash",
    "clean": "rm -rf build/*",
    "copyResources": "mkdir -p src/resources; cp -r src/resources build",
    "re": "npm-run-all clean buildTs copyResources buildNS buildManifest",
    "webserver": "node bin/webserver.js -p 9182 -d build --enable_cors"
  },
  "devDependencies": {
    "npm-run-all": "^4.1.5"
  }
}
```

- `build`: Runs everything necessary to build `ts` files into js and
  convert `js` files to `ns` before writing their paths to the
  `resources/manifest.txt` file.
- `buildTs`: runs `tsc`
- `buildNS`: runs the `bin/buildNS.bash` script to convert `.js` to
  `.ns`
- `buildManifest`: runs the `bin/generateManifest.bash` to generate
  `resources/manifest.txt` file containing paths to all your scripts.
- `clean`: cleans build folder
- `copyResources`: `cp`s resources to build folder
- `re`: I like make, sue me :|
- `webserver`: runs the tiny webserver that will serve your scripts so
  that you can `wget` them from the game.
  - Careful with the server, CORS are activated, so do not serve any
  sensitive data! You never know~

## TypeScript compiler configuration (`tsconfig.json`)

```json
{
	"compilerOptions": {
		"target": "ES2021",
		"module": "ES2020",
		"rootDir": "src/",
		"baseUrl": "src/",
		"paths": {
			"/lib/*": [ "lib/*" ]
		},
		"outDir": "build/",
		"moduleResolution": "node",
		"strictNullChecks": true,
		"strictPropertyInitialization": true
	}
}
```

- `target` and `module`: Set to generate 'raw' js to avoid any
  compatibility errors in NS. I did not test every possible value,
  but these seem to work. `commonjs` fails, so does `es5`, because
  of the generated `Object.setPorperty(exports ...)` and such.
- `rootDir` `baseUrl` and `paths`: Allows replacing import references
  with an absolute path.
- You can change `lib` to whatever you want, or even add more if you
  want.
- `outDir` is used by the scripts in the `bin` folder. Be sure to change
  them accordingly if you change that.

These are the important bits in the `tsc` config; the rest is optional.
Refer to the `tsc` documentation if you want to make modifications.

## Bash scripts and webserver

- `bin/webserver.js`: Just a webserver that serves the `build` folder to
  be able to `wget` your scripts from the game.
- `bin/buildNS.bash`: Simple script that appends `.ns` to `imports` in
  javascript files before converting them to `.ns`.
- `bin/generateManifest.bash`: Simple script that `find`s every `.ns` in
  the build folder and writes its path to `resources/manifest.txt`. This
  is used to pull all files on your in-game filesystem.

These helper scripts are called by `npm run` commands listed in
`package.json`.

## Code

### Organisation

The type definition for NetScript (the `NS` type and other game APIs) is
located in `src/lib/Bitburner.t.ts` and is taken directly from the
[Bitburner repo](https://github.com/danielyxie/bitburner/blob/dev/dist/bitburner.d.ts).

'Executable scripts' are located in the `src/bin` subfolder and will
generally contain main functions. This is just for tidiness and
completely optional.

'Library' files are stored in `src/lib` to make it easier to make sure
links are correct when generating `.ns` files.

### Files

- `src/bin/sayHelloTs.ts`: A sample script referencing utils and logging
  dummy string to the terminal to test the setup.
- `src/bin/utils/initRepo.ts`: A simple script with no references. Used
  to init the repo the first time when no files are available on the
  game home server.
- `src/bin/utils/pullFiles.ts`: Utility script that `wget`s the
  `manifest.txt` file from the server and downloads all scripts to the
  same location on the game home.
- `src/lib/Helpers.ts`: Just some helper functions to make things neater
  in executable scripts.

# Recommendations

I would recommend not putting any files in the root of the `src` folder.
For some reason, I had a lot of problems when trying to get them from
the `wget` cmdlet in-game. It creates a ghost `/` folder in-game,
sometimes creates ghost files, etc...

Just putting everything in a subfolder (like `src/lib` or `src/bin`)
seems to be a workaround.

Putting every file that is referenced by other files in the `src/lib`
folder helps with the module resolution. Since NS only understands
absolute paths (starting with `/`, from the root of the game
filesystem), it's easier to make a rule that replaces `imports` with
their absolute version. **If you want to add more than just the
`src/lib` folder to these `roots`, you need to change the settings
`paths` in the `tsconfig.json` file**

Always check that your IDE / tools don't import modules like this:

```typescript
import { Blep } from "../lib/Blep";
```

BitBurner doesn't understand relative path, so even though this will
compile fine, it will not run in-game. Make sure they look like this
instead (absolute path, c.f previous paragraph):

```typescript
import { Blep } from "/lib/Blep";
```

This would result in this javascript:

```js
import { Blep } from "/lib/Blep";
```

which is valid for the game.

# Contributing

Feel free to send PRs!
