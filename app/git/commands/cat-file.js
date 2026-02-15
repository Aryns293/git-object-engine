const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

class CatFileCommand {
  constructor(flag, sha) {
    this.flag = flag;
    this.sha = sha;
    this.gitDir = path.join(process.cwd(), ".git");
  }

  execute() {
    if (!this.sha) {
      console.error("Provide object SHA");
      process.exit(1);
    }

    const objectPath = path.join(
      this.gitDir,
      "objects",
      this.sha.slice(0, 2),
      this.sha.slice(2)
    );

    if (!fs.existsSync(objectPath)) {
      console.error("Object not found");
      process.exit(1);
    }

    const compressed = fs.readFileSync(objectPath);
    const raw = zlib.inflateSync(compressed);

    const nullIndex = raw.indexOf(0);
    const header = raw.slice(0, nullIndex).toString();
    const content = raw.slice(nullIndex + 1);

    const [type] = header.split(" ");

    if (this.flag === "-p") {
      if (type === "blob") {
        process.stdout.write(content.toString());
      } else {
        process.stdout.write(content.toString());
      }
    } else {
      console.log(type);
    }
  }
}

module.exports = CatFileCommand;