const accordionItems = [
  {
    title: "Make",
    commands: [
      {
        description: "Create a new migration file",
        command: "make:migration",
        needInput: true,
        label: "Enter migration name:"
      },
      {
        description: "Create a new action class",
        command: "make:action",
        needInput: true,
        label: "Enter action name:"
      },
      {
        description: "Create a new anonymous component class",
        command: "make:anonymous-component",
        needInput: true,
        label: "Enter component name:"
      },
      {
        description: "Create a new channel class",
        command: "make:channel",
        needInput: true,
        label: "Enter channel name:"
      },
      {
        description: "Create a new command class",
        command: "make:command",
        needInput: true,
        label: "Enter command name:"
      },
      {
        description: "Create a new component class",
        command: "make:component",
        needInput: true,
        label: "Enter component name:"
      },
      {
        description: "Create a new controller class",
        command: "make:controller",
        needInput: true,
        label: "Enter controller name:"
      },
      {
        description: "Create a new event class",
        command: "make:event",
        needInput: true,
        label: "Enter event name:"
      },
      {
        description: "Create a new exception class",
        command: "make:exception",
        needInput: true,
        label: "Enter exception name:"
      },
      {
        description: "Create a new factory class",
        command: "make:factory",
        needInput: true,
        label: "Enter factory name:"
      },
      {
        description: "Create a new job class",
        command: "make:job",
        needInput: true,
        label: "Enter job name:"
      },
      {
        description: "Create a new listener class",
        command: "make:listener",
        needInput: true,
        label: "Enter listener name:"
      },
      {
        description: "Create a new mailable class",
        command: "make:mail",
        needInput: true,
        label: "Enter mailable name:"
      },
      {
        description: "Create a new middleware class",
        command: "make:middleware",
        needInput: true,
        label: "Enter middleware name:"
      },
      {
        description: "Create a new model class",
        command: "make:model",
        needInput: true,
        label: "Enter model name:"
      },
      {
        description: "Create a new notification class",
        command: "make:notification",
        needInput: true,
        label: "Enter notification name:"
      },
      {
        description: "Create a new observer class",
        command: "make:observer",
        needInput: true,
        label: "Enter observer name:"
      },
      {
        description: "Create a new policy class",
        command: "make:policy",
        needInput: true,
        label: "Enter policy name:"
      },
      {
        description: "Create a new provider class",
        command: "make:provider",
        needInput: true,
        label: "Enter provider name:"
      },
      {
        description: "Create a new request class",
        command: "make:request",
        needInput: true,
        label: "Enter request name:"
      },
      {
        description: "Create a new resource collection class",
        command: "make:resource",
        needInput: true,
        label: "Enter resource name:"
      },
      {
        description: "Create a new rule class",
        command: "make:rule",
        needInput: true,
        label: "Enter rule name:"
      },
      {
        description: "Create a new seeder class",
        command: "make:seeder",
        needInput: true,
        label: "Enter seeder name:"
      },
      {
        description: "Create a new test class",
        command: "make:test",
        needInput: true,
        label: "Enter test name:"
      }
    ]
  },
  {
    title: "Migrate",
    commands: [
      {
        description: "Run the database migrations",
        command: "migrate",
        needInput: false
      },
      {
        description: "Rollback the last database migration",
        command: "migrate:rollback",
        needInput: false
      },
      {
        description: "Rollback all database migrations",
        command: "migrate:reset",
        needInput: false
      },
      {
        description: "Rollback the last database migration",
        command: "migrate:refresh",
        needInput: false
      },
      {
        description: "Create a new migration file",
        command: "migrate:install",
        needInput: false
      },
      {
        description: "Drop all tables and re-run all migrations",
        command: "migrate:fresh",
        needInput: false
      },
      {
        description: "Show the status of each migration",
        command: "migrate:status",
        needInput: false
      }
    ]
  },
  {
    title: "DB",
    commands: [
      {
        description: "Seed the database with records",
        command: "db:seed",
        needInput: false
      },
      { description: "Wipe the database", command: "db:wipe", needInput: false }
    ]
  },
  {
    title: "Route",
    commands: [
      {
        description: "List all registered routes",
        command: "route:list",
        needInput: false
      },
      {
        description: "Create a route cache file for faster route registration",
        command: "route:cache",
        needInput: false
      },
      {
        description: "Clear the route cache file",
        command: "route:clear",
        needInput: false
      }
    ]
  },
  {
    title: "Cache",
    commands: [
      {
        description: "Flush the application cache",
        command: "cache:clear",
        needInput: false
      },
      {
        description: "Create a cache table migration",
        command: "cache:table",
        needInput: false
      },
      {
        description: "Forget all items from the cache",
        command: "cache:forget --key=yourKeyHere",
        needInput: true
      }
    ]
  },
  {
    title: "Config",
    commands: [
      {
        description: "Create a cache file for faster configuration loading",
        command: "config:cache",
        needInput: false
      },
      {
        description: "Clear the configuration cache file",
        command: "config:clear",
        needInput: false
      }
    ]
  },
  {
    title: "View",
    commands: [
      {
        description: "Compile all of the application's Blade templates",
        command: "view:cache",
        needInput: false
      },
      {
        description: "Clear all compiled view files",
        command: "view:clear",
        needInput: false
      }
    ]
  },
  {
    title: "Queue",
    commands: [
      {
        description: "List all of the failed queue jobs",
        command: "queue:failed",
        needInput: false
      },
      {
        description: "Flush all of the failed queue jobs",
        command: "queue:flush",
        needInput: false
      },
      {
        description: "Delete a failed queue job",
        command: "queue:forget",
        needInput: true
      },
      {
        description: "Restart queue worker daemons after their current job",
        command: "queue:restart",
        needInput: false
      },
      {
        description: "Retry a failed queue job",
        command: "queue:retry",
        needInput: true
      },
      {
        description: "Retry all of the failed queue jobs",
        command: "queue:retry-batch",
        needInput: false
      },
      {
        description:
          "Create a migration for the failed queue jobs database table",
        command: "queue:failed-table",
        needInput: false
      },
      {
        description: "Listen to a given queue",
        command: "queue:listen",
        needInput: false
      },
      {
        description: "Create a migration for the queue jobs database table",
        command: "queue:table",
        needInput: false
      },
      {
        description: "Start processing jobs on the queue as a daemon",
        command: "queue:work",
        needInput: false
      }
    ]
  },
  {
    title: "Other",
    commands: [
      {
        description: "Set the application key",
        command: "key:generate",
        needInput: false
      },
      {
        description: "Bring the application out of maintenance mode",
        command: "up",
        needInput: false
      },
      {
        description: "Put the application into maintenance mode",
        command: "down",
        needInput: false
      },
      {
        description: "Clear all compiled files",
        command: "clear-compiled",
        needInput: false
      },
      {
        description: "Remove the compiled class file",
        command: "optimize:clear",
        needInput: false
      },
      {
        description: "Clear the cached bootstrap files",
        command: "optimize",
        needInput: false
      },
      {
        description: "Create a migration for the session database table",
        command: "session:table",
        needInput: false
      },
      {
        description:
          'Create a symbolic link from "public/storage" to "storage/app/public"',
        command: "storage:link",
        needInput: false
      }
    ]
  }
];

const commandsAccordion = document.getElementById("commandsAccordion");
accordionItems.forEach((item, index) => {
  const accordionItem = document.createElement("div");
  accordionItem.className = "accordion-item";

  const headerId = `heading${index}`;
  const collapseId = `collapse${index}`;

  accordionItem.innerHTML = `
		<h2 class="accordion-header" id="${headerId}">
			<button class="accordion-button ${index !== 0 ? "collapsed" : ""}" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}">
				${item.title}
			</button>
		</h2>
		<div id="${collapseId}" class="accordion-collapse collapse ${index === 0 ? "show" : ""}" data-bs-parent="#commandsAccordion">
			<div class="accordion-body">
				${item.commands
          .map(
            (command) => `
							<button
								id="command-btn-${command.command}"
								class="btn btn-primary btn-sm me-1 mb-1 command-btn"
								data-label-content="${command.label || ""}"
								data-need-input="${command.needInput}"
								data-description="${command.description}"
								data-command="${command.command}"
							>
								${command.command}
								</button>
						`
          )
          .join("")}
			</div>
		</div>
	`;

  commandsAccordion.appendChild(accordionItem);
});

// listen event open accordion, after save to local storage
commandsAccordion.addEventListener("shown.bs.collapse", (e) => {
  const activeAccordion = e.target.id;
  localStorage.setItem("activeAccordion", activeAccordion);
});

// close
commandsAccordion.addEventListener("hidden.bs.collapse", (e) => {
  localStorage.removeItem("activeAccordion");
});

// open accordion after reload page
const activeAccordion = localStorage.getItem("activeAccordion");
if (activeAccordion) {
  const accordion = document.getElementById(activeAccordion);
  const accordionCollapse = new bootstrap.Collapse(accordion);
  accordionCollapse.show();
}

// Add search functionality
const searchInput = document.getElementById("command-search-input");
const searchResult = document.getElementById("search-result");

searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  let found = false;

  // reset all buttons to default
  const buttons = document.querySelectorAll(".command-btn");
  buttons.forEach((button) => {
    button.classList.remove("btn-success");
    button.classList.add("btn-primary");
  });

  let total = 0;

  for (let i = 0; i < accordionItems.length; i++) {
    const item = accordionItems[i];
    const btnAccordion = document.getElementById(
      `heading${i}`
    ).firstElementChild;
    const accordionItem = document.getElementById(`collapse${i}`);
    let commands = item.commands.filter(
      (command) =>
        command.command.toLowerCase().includes(searchTerm) ||
        command.description.toLowerCase().includes(searchTerm)
    );
    if (!searchTerm) {
      commands = []; // reset commands
      searchResult.innerHTML = "";
    }

    if (commands.length > 0) {
      if (!found) {
        const accordionCollapse = new bootstrap.Collapse(accordionItem, {
          toggle: false
        });
        accordionCollapse.show();
      } else {
        btnAccordion.classList.add("bg-success");
        btnAccordion.classList.add("text-white");
      }

      total += commands.length;
      found = true;
      // highlight search term
      for (const command of commands) {
        const button = document.getElementById(
          `command-btn-${command.command}`
        );
        console.log(button);
        button.scrollIntoView({ behavior: "smooth", block: "center" });
        button.classList.remove("btn-primary");
        button.classList.add("btn-success");
      }
    } else {
      const accordionCollapse = new bootstrap.Collapse(accordionItem, {
        toggle: false
      });
      accordionCollapse.hide();

      btnAccordion.classList.remove("bg-success");
      btnAccordion.classList.remove("text-white");
    }
  }

  if (!searchTerm) {
    searchResult.innerHTML = "";
  } else {
    searchResult.innerHTML = `${total} command${
      total > 1 ? "s" : ""
    } found for "${searchTerm}"`;
  }

  if (!found) {
    // Optionally handle case when no command is found
  }
});
