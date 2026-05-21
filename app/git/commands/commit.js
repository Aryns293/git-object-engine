const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const zlib = require("zlib");
const Index = require("../index");

class CommitCommand {
  constructor(message) {
    this.message = message;
    this.gitDir = path.join(process.cwd(), ".git");
    this.author = "Aryan Sharma <arynshr293@gmail.com>";
  }

  readObject(sha) {
    const objPath = path.join(
      this.gitDir,
      "objects",
      sha.slice(0, 2),
      sha.slice(2)
    );
    const raw = zlib.inflateSync(fs.readFileSync(objPath));
    const nullIndex = raw.indexOf(0);
    const content = raw.slice(nullIndex + 1);
    return content;
  }

  writeTree() {
    const index = new Index();
    const entries = index.read();

    if (Object.keys(entries).length === 0) {
      console.error("Nothing to commit — staging area is empty");
      process.exit(1);
    }

    const buffers = [];
    Object.keys(entries)
      .sort()
      .forEach((file) => {
        const sha = entries[file];
        const mode = "100644";
        const header = Buffer.from(`${mode} ${file}\0`);
        const shaBuffer = Buffer.from(sha, "hex");
        buffers.push(header, shaBuffer);
      });

    const content = Buffer.concat(buffers);
    const header = Buffer.from(`tree ${content.length}\0`);
    const store = Buffer.concat([header, content]);
    const sha = crypto.createHash("sha1").update(store).digest("hex");

    const dir = path.join(this.gitDir, "objects", sha.slice(0, 2));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, sha.slice(2)), zlib.deflateSync(store));

    index.clear();
    return sha;
  }

  getParentSha() {
    const headPath = path.join(this.gitDir, "HEAD");
    const ref = fs.readFileSync(headPath, "utf-8").trim();

    if (ref.startsWith("ref:")) {
      const refPath = path.join(this.gitDir, ref.replace("ref: ", ""));
      if (fs.existsSync(refPath)) {
        return fs.readFileSync(refPath, "utf-8").trim();
      }
    }
    return null;
  }

  execute() {
    if (!this.message) {
      console.error("Provide commit message: commit -m <message>");
      process.exit(1);
    }

    const treeSha = this.writeTree();
    const parentSha = this.getParentSha();
    const timestamp = Math.floor(Date.now() / 1000);

    let content = `tree ${treeSha}\n`;
    if (parentSha) content += `parent ${parentSha}\n`;
    content += `author ${this.author} ${timestamp} +0000\n`;
    content += `committer ${this.author} ${timestamp} +0000\n\n`;
    content += `${this.message}\n`;

    const body = Buffer.from(content);
    const header = Buffer.from(`commit ${body.length}\0`);
    const store = Buffer.concat([header, body]);
    const sha = crypto.createHash("sha1").update(store).digest("hex");

    const dir = path.join(this.gitDir, "objects", sha.slice(0, 2));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, sha.slice(2)), zlib.deflateSync(store));

    const headPath = path.join(this.gitDir, "HEAD");
    const ref = fs.readFileSync(headPath, "utf-8").trim();
    if (ref.startsWith("ref:")) {
      const refPath = path.join(this.gitDir, ref.replace("ref: ", ""));
      fs.mkdirSync(path.dirname(refPath), { recursive: true });
      fs.writeFileSync(refPath, sha);
    }

    console.log(`[main ${sha.slice(0, 7)}] ${this.message}`);
  }
}

module.exports = CommitCommand;