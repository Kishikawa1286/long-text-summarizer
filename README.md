# Summa-Doc

## Setup

### 1. install yarn packages

Run:

```
yarn
```

### 2. Create .env file

Copy `.env.example` as `.env`

```
cp .env.example .env
```

Set `OPENAI_ACCESS_TOKEN` .
You can find it in https://chat.openai.com/api/auth/session

### 3. Execute

List urls you want to access like:

```
https://docs.github.com/en/get-started/learning-about-github/githubs-products
https://docs.github.com/en/get-started/onboarding/getting-started-with-your-github-account
https://docs.github.com/en/get-started/onboarding/getting-started-with-github-team

```

To execute, run:

```
npm run start
```
