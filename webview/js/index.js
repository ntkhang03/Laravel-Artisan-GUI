const vscode = acquireVsCodeApi();
let selectedCommand = "";

document.addEventListener("DOMContentLoaded", () => {
  const commandButtons = document.querySelectorAll(".command-btn");
  const fileSelectContainer = document.getElementById("file-select-container");
  const fileSelect = document.getElementById("file-select");
  const customCommandInput = document.getElementById("custom-command");
  const executeButton = document.getElementById("execute-btn");
  const outputArea = document.getElementById("output");
  const outputContainer = document.getElementById("output-container");
  const commandDescription = document.getElementById("command-description");
  const folderPath = document.getElementById("folder-path");
  const selectFolderButton = document.getElementById("select-folder-btn");
  const themeToggleButton = document.getElementById("theme-toggle-btn");
  const labelInputContainer = document.getElementById("label-input-container");
  const commandOptions = document.getElementById("command-options");
  const labelInput = document.getElementById("label-input-label");

  commandButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedCommand = button.dataset.command;
      fileSelectContainer.style.display = "none";
      fileSelect.innerHTML = "";
      customCommandInput.value = "";
      commandDescription.textContent = button.dataset.description;
      commandDescription.classList.remove("d-none");

      // data-label-content
      const label = button.dataset.labelContent;
      if (label) {
        labelInputContainer.style.display = "block";
        labelInput.textContent = label;
      }

      if (
        selectedCommand === "migrate:rollback" ||
        selectedCommand === "db:seed"
      ) {
        loadFileOptions(
          selectedCommand === "migrate:rollback" ? "migrations" : "seeders"
        );
      } else if (selectedCommand === "migrate") {
        loadFileOptions("migrations");
      }

      customCommandInput.value = selectedCommand;
    });
  });

  customCommandInput.addEventListener("input", customCommandChanged);
  customCommandInput.addEventListener("change", customCommandChanged);

  function customCommandChanged() {
    labelInputContainer.style.display = "none";
    labelInput.textContent = "";
    commandOptions.value = "";

    selectedCommand = customCommandInput.value || "";

    fileSelectContainer.style.display = "none";
    fileSelect.innerHTML = "";
    const description =
      Array.from(commandButtons).find(
        (button) =>
          selectedCommand.split(" ")[0] == button.dataset.command &&
          selectedCommand.startsWith(button.dataset.command)
      )?.dataset.description || "";
    commandDescription.textContent = description;
    if (!commandDescription.textContent) {
      commandDescription.classList.add("d-none");
    } else {
      commandDescription.classList.remove("d-none");
    }
  }

  function loadFileOptions(type) {
    vscode.postMessage({
      command: "getFiles",
      type: type,
      folderPath: folderPath.value
    });
  }

  executeButton.addEventListener("click", () => {
    outputArea.textContent = "";
    outputContainer.classList.remove("alert-success");
    outputContainer.classList.remove("alert-danger");

    // check command is empty
    if (!selectedCommand) {
      outputArea.textContent = "Please select a command";
      customCommandInput.focus();
      outputContainer.classList.remove("alert-success");
      outputContainer.classList.add("alert-danger");
      return;
    }

    executeButton.disabled = true;
    executeButton.innerHTML =
      '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';

    const selectedFile = fileSelect.value;
    let customCommand = customCommandInput.value;

    // data-need-input
    const needInput = Array.from(commandButtons).find(
      (button) => selectedCommand.split(" ")[0] == button.dataset.command
    )?.dataset.needInput;
    if (needInput == "true") {
      if (
        !selectedFile &&
        !selectedCommand.split(" ")[1] &&
        !commandOptions.value
      ) {
        outputArea.textContent = "Please enter a file name";
        outputContainer.classList.remove("alert-success");
        outputContainer.classList.add("alert-danger");
        executeButton.disabled = false;
        executeButton.innerHTML = "Execute";
        return;
      }
    }

    let fullCommand = customCommand;
    if (
      selectedCommand === "migrate:rollback" ||
      selectedCommand === "db:seed"
    ) {
      if (selectedFile) {
        // Find --path or --class option index
        const pathOptionIndex = customCommand
          .split(" ")
          .findIndex((part) => part === "--path" || part === "--class");
        let pathOptionValue = "";
        if (pathOptionIndex > -1) {
          pathOptionValue = customCommand.split(" ")[pathOptionIndex + 1];
          // Remove --path/--class option and its value from customCommand
          customCommand = customCommand
            .split(" ")
            .filter(
              (part, index) =>
                index !== pathOptionIndex && index !== pathOptionIndex + 1
            )
            .join(" ");
        }
        fullCommand = customCommand;
        // Add --path or --class option with selected file
        fullCommand +=
          selectedCommand === "migrate:rollback"
            ? ` --path=database/migrations/${selectedFile}`
            : ` --class=${selectedFile.replace(/\.php$/, "")}`;

        // Restore original --path/--class option if it was present
        if (pathOptionIndex > -1) {
          fullCommand += ` --path=${pathOptionValue}`;
        }
      } else {
        fullCommand = customCommand;
      }
    } else if (customCommand) {
      fullCommand = customCommand;
    }

    if (commandOptions.value) {
      fullCommand += ` ${commandOptions.value}`;
    }

    console.log(fullCommand);

    vscode.postMessage({
      command: "executeCommand",
      fullCommand: fullCommand,
      folderPath: folderPath.value
    });
  });

  selectFolderButton.addEventListener("click", () => {
    vscode.postMessage({
      command: "selectFolder"
    });
  });

  themeToggleButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    // save the theme preference
    const isDarkTheme = document.body.classList.contains("dark-theme");
    //  send the theme preference to the extension to save it
    vscode.postMessage({
      command: "setTheme",
      isDarkTheme
    });
  });

  window.addEventListener("message", (event) => {
    const message = event.data;
    switch (message.command) {
      case "commandResult": {
        outputArea.textContent = "";
        // remove class
        outputContainer.classList.remove("alert-success");
        outputContainer.classList.remove("alert-danger");

        const result = message.result || {};

        for (const key in result) {
          if (typeof result[key] === "string") {
            result[key] = result[key].replace(/\u001b\[.*?m/g, "");
          }
        }

        if (result.error) {
          outputContainer.classList.remove("alert-success");
          outputContainer.classList.add("alert-danger");
          outputArea.textContent += `Error: ${typeof result.error === "string" ? result.error : JSON.stringify(result.error, null, 2)}`;
          if (result.stderr) {
            outputArea.textContent += `\n${result.stderr}`;
          }
        } else {
          outputContainer.classList.remove("alert-danger");
          outputContainer.classList.add("alert-success");
          if (selectedCommand == "migrate:status") {
            result.stdout = result.stdout.replace(
              /Ran/g,
              '<i class="bi bi-arrow-up-circle-fill text-success"></i> Ran'
            );
            result.stdout = result.stdout.replace(
              /Pending/g,
              '<i class="bi bi-arrow-down-circle-fill text-danger"></i> Pending'
            );
          }
          outputArea.innerHTML = `${result.stdout}\n`;
        }
        executeButton.disabled = false;
        executeButton.innerHTML = "Execute";
        break;
      }
      case "files": {
        fileSelectContainer.style.display = "block";
        fileSelect.innerHTML = "";
        message.files.forEach((file) => {
          const option = document.createElement("option");
          option.value = file;
          option.text = file;
          fileSelect.appendChild(option);
        });
        break;
      }
      case "setTheme": {
        document.body.classList.toggle("dark-theme", message.isDarkTheme);
        break;
      }
      case "error": {
        outputArea.textContent = message.message;
        break;
      }
      case "selectedFolder": {
        folderPath.value = message.folderPath;
        break;
      }
    }
  });

  // Handle accordion events
  const commandsAccordion = document.getElementById("commandsAccordion");

  commandsAccordion.addEventListener("shown.bs.collapse", (e) => {
    const activeAccordion = e.target.id;
    vscode.setState({ activeAccordion });
  });

  commandsAccordion.addEventListener("hidden.bs.collapse", (e) => {
    vscode.setState({});
  });

  const state = vscode.getState();
  if (state && state.activeAccordion) {
    const accordion = document.getElementById(state.activeAccordion);
    const accordionCollapse = new bootstrap.Collapse(accordion);
    accordionCollapse.show();
  }
});
