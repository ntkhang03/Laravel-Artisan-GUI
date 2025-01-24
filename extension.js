const vscode = require("vscode");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

function activate(context) {
  let panel;

  const laravelProjectLoaded = isLaravelProject(vscode.workspace.rootPath);
  vscode.commands.executeCommand(
    "setContext",
    "laravelProjectLoaded",
    laravelProjectLoaded
  );

  const disposable = vscode.commands.registerCommand(
    "laravel-artisan-gui.showGUI",
    () => {
      if (panel) {
        try {
          panel.reveal();
          return;
        } catch (error) {}
      }

      panel = vscode.window.createWebviewPanel(
        "laravelArtisanGUI",
        "Laravel Artisan GUI",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, "webview"))
          ]
        }
      );
      const iconPath = vscode.Uri.file(
        path.join(context.extensionPath, "webview", "icons", "laravel.svg")
      );
      panel.iconPath = iconPath;

      const webviewPath = vscode.Uri.file(
        path.join(context.extensionPath, "webview", "index.html")
      );
      const indexScriptPath = vscode.Uri.file(
        path.join(context.extensionPath, "webview", "js", "index.js")
      );
      const renderAccordionScriptPath = vscode.Uri.file(
        path.join(context.extensionPath, "webview", "js", "renderAccordion.js")
      );
      const bootstrapCssPath = vscode.Uri.file(
        path.join(context.extensionPath, "webview", "css", "bootstrap.min.css")
      );
      const bootstrapDocsCssPath = vscode.Uri.file(
        path.join(
          context.extensionPath,
          "webview",
          "css",
          "bootstrap-docs.min.css"
        )
      );
      const bootstrapIconsCssPath = vscode.Uri.file(
        path.join(
          context.extensionPath,
          "webview",
          "css",
          "bootstrap-icons.min.css"
        )
      );

      panel.webview.html = fs.readFileSync(webviewPath.fsPath, "utf8");
      const objPath = {
        "{{indexScript}}": indexScriptPath,
        "{{renderAccordionScript}}": renderAccordionScriptPath,
        "{{bootstrapCss}}": bootstrapCssPath,
        "{{bootstrapDocsCss}}": bootstrapDocsCssPath,
        "{{bootstrapIconsCss}}": bootstrapIconsCssPath,
        "{{svgIcon}}": iconPath
      };
      for (const key in objPath) {
        panel.webview.html = panel.webview.html.replace(
          key,
          // @ts-ignore
          panel.webview.asWebviewUri(objPath[key])
        );
      }

      // Handle messages from the webview
      panel.webview.onDidReceiveMessage(
        (message) => {
          switch (message.command) {
            case "executeCommand":
              executeArtisanCommand(message, panel);
              return;
            case "getFiles":
              getFiles(message, panel);
              return;
            case "selectFolder":
              selectFolder(panel);
              return;
            case "setTheme":
              vscode.workspace
                .getConfiguration()
                .update(
                  "laravel-artisan-gui.isDarkTheme",
                  message.isDarkTheme,
                  true
                );
              return;
          }
        },
        undefined,
        context.subscriptions
      );

      // post theme
      const isDarkTheme = vscode.workspace
        .getConfiguration()
        .get("laravel-artisan-gui.isDarkTheme");
      panel.webview.postMessage({ command: "setTheme", isDarkTheme });
    }
  );

  // Thêm view vào activity bar
  vscode.window.registerTreeDataProvider(
    "laravel-artisan-gui.view",
    new TreeDataProvider()
  );

  context.subscriptions.push(disposable);
}

function getFiles(message, panel) {
  const workspaceFolder = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : "";
  const folderPath = message.folderPath
    ? path.join(workspaceFolder, message.folderPath)
    : workspaceFolder;
  let folder = "";

  if (message.type === "migrations") {
    folder = path.join(folderPath, "database/migrations");
  } else if (message.type === "seeders") {
    folder = path.join(folderPath, "database/seeders");
  } else {
    panel.webview.postMessage({ command: "error", message: "Invalid type" });
    return;
  }

  fs.readdir(folder, (err, files) => {
    if (err) {
      panel.webview.postMessage({ command: "error", message: err.message });
      return;
    }
    panel.webview.postMessage({ command: "files", files: files });
  });
}

function executeArtisanCommand(message, panel) {
  const workspaceFolder = vscode.workspace.workspaceFolders
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : "";
  const folderPath = message.folderPath
    ? path.normalize(message.folderPath)
    : workspaceFolder;

  let command = `php artisan ${message.fullCommand}`;

  if (folderPath) {
    if (!fs.existsSync(folderPath)) {
      vscode.window.showErrorMessage(`Folder "${folderPath}" does not exist.`);
      return;
    }
    command = `cd ${folderPath} && ${command}`;
  }

  exec(command, (error, stdout, stderr) => {
    const result = { error, stdout, stderr };
    if (result.error && typeof result.error === "object") {
      result.error = {
        ...result.error,
        // eslint-disable-next-line no-control-regex
        message: result.error?.message.toString().replace(/\u001b\[.*?m/g, ""),
        // eslint-disable-next-line no-control-regex
        stack: result.error?.stack.toString().replace(/\u001b\[.*?m/g, "")
      };
    }

    if (panel) {
      panel.webview.postMessage({ command: "commandResult", result: result });
    } else {
      vscode.window.showErrorMessage("Laravel Artisan GUI panel not found.");
    }
  });
}

function isLaravelProject(rootPath = "") {
  const artisanPath = path.join(rootPath, "artisan");
  return fs.existsSync(artisanPath);
}

function selectFolder(panel) {
  vscode.window
    .showOpenDialog({
      canSelectFolders: true,
      canSelectFiles: false,
      canSelectMany: false
    })
    .then((folderUri) => {
      if (folderUri && folderUri[0]) {
        panel.webview.postMessage({
          command: "selectedFolder",
          folderPath: folderUri[0].fsPath
        });
      }
    });
}

/**
 * Tạo TreeDataProvider để quản lý view
 */
class TreeDataProvider {
  getTreeItem(element) {
    return element;
  }

  getChildren() {
    return [];
  }
}

class TreeItem extends vscode.TreeItem {
  constructor(label, commandId) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.command = { command: commandId, title: label };
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
