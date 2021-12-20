# BitBurner TypeScript template repo

This is a starter repo for anyone wanting to use TypeScript to play
BitBurner!

The template relies on a number of things that you can probably change
to your liking; just be aware they exist and you might need to fiddle
with settings if you change them.

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
  compatibility errors in NS. I did not test everything, but these seem
  to work.
- `rootDir` `baseUrl` and `paths`: Allows replacing import references
  with an absolute path.
- You can change `lib` to whatever you want, or even add more if you
  want.
- `outDir` is used by the scripts in the `bin` folder. Be sure to change
  them accordingly if you change that.

  These are the important bits in the `tsc` config; the rest is optimal.

## Recommendations

I would recommend not putting any files in the root of the `src` folder.
For some reason, I had a lot of problems when trying to get them from
the `wget` cmdlet in-game. It creates a ghost `/` folder in-game,
sometimes creates ghost files, etc..

Just putting everything in a subfolder (like `src/lib` or `src/bin`)
seems to be a workaround.

Putting every file that is referenced by other files in the `src/lib`
folder helps with the module resolution. Since NS only understands
absolute paths (starting with `/`, from the root of the game
filesystem), it's easier to make a rule that replaces `imports` with
their absolute version. **If you want to add more than just the
`src/lib` folder to these `roots`, you need to change the settings
`paths` in the `tsconfig.json` file**

