# Git Object Engine

A simplified, from-scratch implementation of the Git version control system written in Node.js.

This project re-implements Git’s core internal architecture including blobs, trees, commits, object storage, hashing, compression, and commit graph traversal — to deeply understand how Git works under the hood.

---

## 🚀 Overview

git-object-engine demystifies Git by rebuilding its core plumbing commands from scratch.

Instead of treating Git as a black box, this project implements:

- Content-addressable object storage
- SHA-1 hashing
- Zlib compression
- Binary tree object encoding
- Commit Directed Acyclic Graph (DAG)
- A custom staging index
- CLI command execution engine

---

## 🧠 Core Concepts Implemented

### 1️⃣ The `.git` Directory

Recreates Git’s internal repository structure:

```
.git/
  ├── objects/
  ├── refs/
  └── HEAD
```

---

### 2️⃣ Git Objects

#### 🔹 Blob
- Stores raw file contents
- Format: `blob <size>\0<content>`
- SHA-1 hashed
- Zlib compressed

#### 🔹 Tree
- Represents directory structure
- Stores entries in binary format:
  
  ```
  <mode> <filename>\0<20-byte raw SHA>
  ```
- Sorted lexicographically
- Prefixed with: `tree <size>\0`

#### 🔹 Commit
- Points to a tree
- Links to parent commit(s)
- Stores author, committer, timestamp, and message
- Forms a commit DAG

---

## ⚙️ Implemented Commands

| Command | Description |
|----------|-------------|
| `init` | Initialize a new repository |
| `add` | Stage file (creates blob + updates index) |
| `write-tree` | Create tree object from staged files |
| `commit-tree` | Create commit object |
| `cat-file` | Inspect object contents |
| `ls-tree` | List tree contents |
| `log` | Traverse commit history |

---

## 🏗 Architecture

```
app/
  git/
    commands/
      add.js
      hash-object.js
      write-tree.js
      commit-tree.js
      cat-file.js
      ls-tree.js
      log.js
    client.js
    index.js
  main.js
```

Uses a command pattern architecture where each Git command is encapsulated in a class with an `execute()` method.

---

## 🔬 How It Works Internally

### Object Storage

All objects are:

1. Prefixed with header (`type size\0`)
2. SHA-1 hashed
3. Compressed using zlib
4. Stored in:

```
.git/objects/<first2>/<remaining38>
```

---

### Commit Graph

Each commit stores:

```
tree <treeSHA>
parent <parentSHA>
author ...
committer ...

<message>
```

This creates a Directed Acyclic Graph (DAG) enabling history traversal.

---

## 🧪 Example Workflow

```bash
# Initialize repository
git-object-engine init

# Add file
echo "Hello Git" > file.txt
git-object-engine add file.txt

# Create tree
treeSHA=$(git-object-engine write-tree)

# Create commit
commitSHA=$(git-object-engine commit-tree $treeSHA "" "Initial commit")

# View history
git-object-engine log $commitSHA
```

---

## 📚 Learning Goals

This project was built to:

- Understand Git internals beyond surface usage
- Learn content-addressable storage systems
- Implement binary encoding and decoding
- Work with hashing and compression
- Build a CLI tool from scratch
- Understand DAG-based version history

---

## ⚠️ Limitations

This is an educational implementation and does not include:

- Branch management
- Checkout
- Merge handling
- Pack files
- Reflog
- Advanced index format

---

## 👨‍💻 Author

Aryan Sharma  
Software Engineering  
Delhi Technological University

---

## 📌 Why This Project Matters

Most developers know how to *use* Git.

Very few understand how Git actually works internally.

This project bridges that gap.