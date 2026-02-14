# Push This Website to GitHub (rajeevdce90)

Your current remote is **AvgAIJoe/TableTurnrLP**. To push a copy to your account **rajeevdce90**, follow these steps.

---

## Step 1: Create the new repo on GitHub

1. Open **https://github.com/new**
2. Log in as **rajeevdce90** (or the account you want to use).
3. Set:
   - **Repository name:** `TableTurnr-Website` (or any name you like)
   - **Visibility:** Public (or Private)
   - **Do not** check "Add a README", "Add .gitignore", or "Choose a license" (you already have code).
4. Click **Create repository**.

---

## Step 2: Add the new remote and push

In a terminal (PowerShell or Git Bash) in this folder, run:

```powershell
cd "c:\Users\rajee\OneDrive\Documents\TableTurnr Website"

# Add your GitHub as a second remote (use the repo name you chose in Step 1)
git remote add rajeev https://github.com/rajeevdce90/TableTurnr-Website.git

# Push the current branch (rajeev_changes) to your repo
# You'll be prompted to sign in to GitHub as rajeevdce90 if needed
git push -u rajeev rajeev_changes
```

To push the same content as the `master` branch on your repo:

```powershell
git push -u rajeev rajeev_changes:main
```

(or use `master` instead of `main` if your new repo uses `master`).

---

## If you get authentication errors

- **HTTPS:** When Git asks for credentials, use your GitHub **username** (rajeevdce90) and a **Personal Access Token** (not your password). Create one at: **GitHub → Settings → Developer settings → Personal access tokens**.
- **SSH:** If you use SSH keys with rajeevdce90, use the SSH remote instead:
  ```powershell
  git remote add rajeev git@github.com:rajeevdce90/TableTurnr-Website.git
  ```

---

## Summary

- **Current remote (unchanged):** `origin` → AvgAIJoe/TableTurnrLP  
- **New remote:** `rajeev` → rajeevdce90/TableTurnr-Website (after you create the repo and run the commands above).
