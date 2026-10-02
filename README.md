# Kanban

A simple project management Kanban app.

## Download

1. Go to the [latest release](https://github.com/swhoyle/Kanban/releases/latest).
2. Under **Assets**, download the `Setup.exe` file.
3. Run it. Kanban installs itself and opens when it finishes.

Windows may show a "Windows protected your PC" warning because the app is not code-signed. Click **More info**, then **Run anyway**.

Your projects and tasks are saved to `%APPDATA%\Kanban\tickets.json`. Updating or reinstalling the app does not delete them.

## Development

```powershell
npm install
npm start
```

## Building the installer

```powershell
npm run make
```

The installer is created in `out/make/squirrel.windows/x64/`. To build only the runnable app folder without an installer, use `npm run package`.

## Publishing a release

1. Update `version` in `package.json`.
2. Run `npm run make`.
3. On GitHub, create a new release, then upload the `Setup.exe` from `out/make/squirrel.windows/x64/` as an asset.
