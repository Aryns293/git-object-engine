# Git Object Engine

A from-scratch reimplementation of Git's core internals in Node.js — including blobs, trees, commits, SHA-1 hashing, zlib compression, and DAG-based commit traversal.

> Demystifies Git by rebuilding its plumbing layer from scratch. Objects generated are **fully compatible with real Git**.

---

## 🔥 What This Project Covers

Instead of treating Git as a black box, this project implements:

- Content-addressable object storage
- SHA-1 hashing
- Zlib compression
- Binary tree object encoding
- Commit Directed Acyclic Graph (DAG)
- Custom staging index
- CLI command execution engine

---

## 🧠 Mental Model (End-to-End Flow)

```
file.txt
    ↓ add
blob (SHA1)
    ↓ index (staging)
commit -m "message"
    ↓
tree object + commit object (linked via parent → DAG)
```

---

## ⚙️ Implemented Commands

### 🧑‍💻 Porcelain (User Friendly)

| Command | Description | Real Git Equivalent |
|---|---|---|
| init | Initialize repository | git init |
| add | Stage file | git add |
| commit -m | Commit staged files | git commit -m |
| log | Traverse commit history | git log |
| diff | Compare two commits with colored output | git diff |

### 🔧 Plumbing (Internal / Advanced)

| Command | Description | Real Git Equivalent |
|---|---|---|
| hash-object | Hash and store a file as blob | git hash-object |
| write-tree | Create tree object from index | git write-tree |
| commit-tree | Create commit object manually | git commit-tree |
| cat-file | Inspect any object by SHA | git cat-file |
| ls-tree | List tree contents | git ls-tree |

---

## 🏗 Project Structure

```
app/
  git/
    commands/
      add.js
      commit.js
      commit-tree.js
      cat-file.js
      diff.js
      hash-object.js
      init.js
      log.js
      ls-tree.js
      write-tree.js
    client.js
    index.js
  main.js
```

✔ Uses a **Command Pattern** — each Git command is an independent class with an `execute()` method.

---

## 🔬 Internal Working

### 📦 Object Storage

All objects follow Git's exact binary format:

```
<type> <size>\0<content>
```

Then:
- SHA-1 hashed → content-addressable ID
- Zlib compressed → stored efficiently
- Saved to `.git/objects/<first2>/<remaining38>`

---

### 🌳 Tree Object (Binary Encoding)

```
<mode> <filename>\0<20-byte raw SHA>
```

- Sorted lexicographically
- Matches real Git tree structure exactly

---

### 🧾 Commit Object

```
tree <treeSHA>
parent <parentSHA>
author <name> <timestamp>
committer <name> <timestamp>

<message>
```

👉 Forms a **Directed Acyclic Graph (DAG)** enabling full history traversal

---

### 🎨 Diff Output (Colored)

```
diff → file.txt
--- file.txt (commit1)
+++ file.txt (commit2)
- Hello Git
+ Hello Git Updated
```

Red = deleted lines, Green = added lines

---

## 🧪 Example Workflow

```bash
# Initialize repository
git-object-engine init

# Create and stage a file
echo "Hello Git" > file.txt
git-object-engine add file.txt

# Commit
git-object-engine commit -m "Initial commit"

# View history (reads HEAD automatically)
git-object-engine log

# Make changes and commit again
echo "Hello Git Updated" > file.txt
git-object-engine add file.txt
git-object-engine commit -m "Update file"

# Diff between two commits
git-object-engine diff <commit1SHA> <commit2SHA>
```

---

## 📦 Installation & Setup

```bash
git clone https://github.com/Aryns293/git-object-engine
cd git-object-engine
npm install
sudo npm link
```

Now you can run:

```bash
git-object-engine <command>
```

---

## ✅ Real Git Compatible

Objects created by this engine are fully compatible with real Git.
You can copy `.git/objects/` into any real Git repository and inspect them with `git cat-file`.

---

## 🐛 Bug Fixes & Improvements

- Fixed staging area not clearing after commit
- Fixed SHA leaking to console during `git add`
- Fixed staging area not clearing after `write-tree`
- Made `cat-file -t` flag explicit with proper error on unknown flags
- Improved `git log` to show author and human-readable date

---

## 🔑 Key Technical Highlights

- **Real binary compatibility** — objects can be read by actual Git
- **Content-addressable storage** — same content always produces same SHA
- **Real zlib compression** — not simulated, same algorithm as Git
- **DAG traversal** — walks commit history via parent pointers
- **Command Pattern architecture** — each command is independent and extensible

---

## 📚 Learning Objectives

This project helps you:

- Understand Git beyond surface-level usage
- Learn content-addressable storage systems
- Work with hashing and compression
- Implement binary encoding/decoding
- Build CLI tools from scratch
- Understand DAG-based version history

---

## 🔮 Future Plans

- Branch creation and switching
- Checkout command
- Merge handling
- Packfile support for large repos
- Reflog for recovery
- `git status` command
- `git stash` command

---

## 👨‍💻 Author

**Aryan Sharma**
Delhi Technological University

---

## 📌 Why This Project Matters

Most developers know how to use Git.
Very few understand how Git actually works internally.

👉 This project bridges that gap.
