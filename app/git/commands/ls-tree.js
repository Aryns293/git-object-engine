const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

class LsTreeCommand {
  constructor(flag, sha) {
    this.flag = flag;
    this.sha = sha;
    this.gitDir = path.join(process.cwd(), ".git");
    this.nameOnly = flag === "--name-only";
  }

  readObject(sha) {
    const objectPath = path.join(
      this.gitDir,
      "objects",
      sha.slice(0, 2),
      sha.slice(2)
    );

    if (!fs.existsSync(objectPath)) {
      console.error("Object not found");
      process.exit(1);
    }

    const compressed = fs.readFileSync(objectPath);
    return zlib.inflateSync(compressed);
  }

  execute() {
    if (!this.sha) {
      console.error("Provide tree or commit SHA");
      process.exit(1);
    }

    let raw = this.readObject(this.sha);
    let nullIndex = raw.indexOf(0);
    let header = raw.slice(0, nullIndex).toString();
    let content = raw.slice(nullIndex + 1);

    let [type] = header.split(" ");

    // If commit, resolve tree
    if (type === "commit") {
      const text = content.toString();
      const match = text.match(/^tree ([a-f0-9]{40})/m);
      if (!match) {
        console.error("Commit does not reference tree");
        process.exit(1);
      }
      raw = this.readObject(match[1]);
      nullIndex = raw.indexOf(0);
      header = raw.slice(0, nullIndex).toString();
      content = raw.slice(nullIndex + 1);
    }

    let offset = 0;

    while (offset < content.length) {
      const modeEnd = content.indexOf(32, offset);
      const mode = content.slice(offset, modeEnd).toString();

      const nameEnd = content.indexOf(0, modeEnd + 1);
      const name = content.slice(modeEnd + 1, nameEnd).toString();

      const shaStart = nameEnd + 1;
      const shaEnd = shaStart + 20;
      const sha = content.slice(shaStart, shaEnd).toString("hex");

      if (this.nameOnly) {
        console.log(name);
      } else {
        const entryType = mode.startsWith("04") ? "tree" : "blob";
        console.log(`${mode} ${entryType} ${sha} ${name}`);
      }

      offset = shaEnd;
    }
  }
}

module.exports = LsTreeCommand;