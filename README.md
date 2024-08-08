# Relif - Zeller API

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/haroldmuller/relif-zeller.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd relif-zeller
    ```

3. **Install dependencies:**

    ```bash
    npm install
    ```

4. **Set up environment variables:**

    Create a `.env` file in the root of the project and add the following:

    ```env
    DB_USER=username
    DB_PASS=password
    OPEN_AI_API_KEY=openai-aki-key
    ```

5. **Start the server:**

    ```bash
    npm start
    ```

    The API will be running on `http://localhost:3000` by default.

## Deployment

This API is automatically deployed to an AWS EC2 instance using GitHub Actions. The deployment process is triggered on every push to the `main` branch.

### GitHub Actions Workflow

The GitHub Actions workflow is configured to:

- Install dependencies
- Run tests
- Build the project
- Deploy the application to the EC2 instance via SSH

You can find the workflow configuration in `.github/workflows/deploy.yml`.
