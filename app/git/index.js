const fs = require("fs");
const path = require("path");

class Index {
  constructor() {
    this.gitDir = path.join(process.cwd(), ".git");
    this.indexPath = path.join(this.gitDir, "index.json");
  }

  read() {
    if (!fs.existsSync(this.indexPath)) return {};
    return JSON.parse(fs.readFileSync(this.indexPath));
  }

  add(filePath, sha) {
    const index = this.read();
    index[filePath] = sha;
    fs.writeFileSync(this.indexPath, JSON.stringify(index, null, 2));
  }

  clear() {
    fs.writeFileSync(this.indexPath, JSON.stringify({}));
  }
}

module.exports = Index;