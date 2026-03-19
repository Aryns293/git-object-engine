# Git Object Engine

A simplified, from-scratch implementation of Git written in Node.js that rebuilds Git’s core internal architecture — including blobs, trees, commits, object storage, hashing, compression, and commit graph traversal.

> This project is designed to **demystify Git internals** by implementing its plumbing layer from scratch.

---

## 🔥 What This Project Covers

Instead of treating Git as a black box, this project implements:

* Content-addressable object storage
* SHA-1 hashing
* Zlib compression
* Binary tree object encoding
* Commit Directed Acyclic Graph (DAG)
* Custom staging index
* CLI command execution engine

---

## 🧠 Mental Model (End-to-End Flow)

```
file.txt
   ↓ add
blob (SHA1)
   ↓ index (staging)
write-tree
   ↓
tree object
   ↓
commit-tree
   ↓
commit (linked via parent → DAG)
```

---

## ⚙️ Implemented Commands

| Command     | Description                      | Real Git Equivalent |
| ----------- | -------------------------------- | ------------------- |
| init        | Initialize repository            | git init            |
| add         | Stage file (create blob + index) | git add             |
| write-tree  | Create tree from index           | git write-tree      |
| commit-tree | Create commit                    | git commit-tree     |
| cat-file    | Inspect object contents          | git cat-file        |
| ls-tree     | List tree contents               | git ls-tree         |
| log         | Traverse commit history          | git log             |

---

## 🏗 Project Structure

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

✔ Uses a **Command Pattern**
Each Git command is implemented as a class with an `execute()` method.

---

## 🔬 Internal Working

### 📦 Object Storage

All objects follow Git’s format:

```
<type> <size>\0<content>
```

Then:

* SHA-1 hashed
* Zlib compressed
* Stored in:

```
.git/objects/<first2>/<remaining38>
```

---

### 🌳 Tree Object (Binary Encoding)

```
<mode> <filename>\0<20-byte raw SHA>
```

* Sorted lexicographically
* Matches real Git tree structure

---

### 🧾 Commit Object

```
tree <treeSHA>
parent <parentSHA>
author <name> <timestamp>
committer <name> <timestamp>

<message>
```

👉 Forms a **Directed Acyclic Graph (DAG)** enabling history traversal

---

## 🧪 Example Workflow

```bash
# Initialize repository
git-object-engine init

# Create a file
echo "Hello Git" > file.txt

# Stage file
git-object-engine add file.txt

# Create tree
treeSHA=$(git-object-engine write-tree)

# Create commit
commitSHA=$(git-object-engine commit-tree $treeSHA "" "Initial commit")

# View history
git-object-engine log $commitSHA
```

---

## 📦 Installation & Setup

```bash
git clone <your-repo-link>
cd git-object-engine

npm install
npm link
```

Now you can run:

```bash
git-object-engine <command>
```

---

## 📚 Learning Objectives

This project helps you:

* Understand Git beyond surface-level usage
* Learn content-addressable storage systems
* Work with hashing and compression
* Implement binary encoding/decoding
* Build CLI tools from scratch
* Understand DAG-based version history

---

## ⚠️ Limitations

This is an educational implementation and does not include:

* Branching
* Checkout
* Merge handling
* Packfiles
* Reflog
* Advanced index format

---

## 👨‍💻 Author

**Aryan Sharma**
Delhi Technological University

---

## 📌 Why This Project Matters

Most developers know how to use Git.

Very few understand how Git actually works internally.

👉 This project bridges that gap.
