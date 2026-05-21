const fs = require("fs");
const path = require("path");

class InitCommand {
  execute() {
    const gitDir = path.join(process.cwd(), ".git");

    fs.mkdirSync(path.join(gitDir, "objects"), { recursive: true });
    fs.mkdirSync(path.join(gitDir, "refs", "heads"), { recursive: true });

    fs.writeFileSync(
      path.join(gitDir, "HEAD"),
      "ref: refs/heads/main\n"
    );

    console.log("Initialized empty Git Object Engine repository");
  }
}

module.exports = InitCommand;