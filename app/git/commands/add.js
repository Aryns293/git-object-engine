const HashObjectCommand = require("./hash-object");
const Index = require("../index");

class AddCommand {
  constructor(filePath) {
    this.filePath = filePath;
  }

  execute() {
    if (!this.filePath) {
      console.error("Specify file to add");
      process.exit(1);
    }

    const hashCmd = new HashObjectCommand("-w", this.filePath);
    const sha = hashCmd.execute();

    const index = new Index();
    index.add(this.filePath, sha);

    console.log(`Added ${this.filePath}`);
  }
}

module.exports = AddCommand;