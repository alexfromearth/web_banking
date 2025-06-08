# Web banking

### Running with Docker

This is an alternative way to run the project if you don't want to manage a local Node.js environment.

> **Prerequisite:** Ensure you have a `.env.local` file in the project root.

1.  **Build the Docker image:**
    ```bash
    pnpm run build:docker
    ```

2.  **Run the container:**
    ```bash
    pnpm run run:docker
    ```

The application will be available at `http://localhost:3000`.

### Running local

- **Node.js**: This project requires **Node.js version 18.x**. It is recommended to use a version manager like `nvm` to ensure compatibility.
  ```bash
  nvm use 18

- **pnpm**: This project uses `pnpm` as the package manager. If you don't have it, install it globally:
  ```bash
  npm install -g pnpm
  ```

### Installation & Running

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Run the development server:**

    ```bash
    pnpm dev
    ```

    The application will be available at [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000).

-----

## Database

The repository includes a pre-built SQLite database file (`db.sqlite`) with seeded user accounts, so you don't need to run migrations or seeds yourself.

### Test Accounts

Here are the accounts available for testing:

| Username         | Password |
| ---------------- | -------- |
| `test@test.com`  | `test`     |
| `test2@test.com` | `test`     |
| `test3@test.com` | `test`     |
| `test4@test.com` | `test`     |
| `test5@test.com` | `test`     |

-----

## Running Tests

This project uses Vitest for unit and integration testing.

To run all tests, use the following command:

```bash
pnpm test
```
