# Node.js Application with Docker and TypeScript

This is a Node.js application built with TypeScript. It can be run either using Docker or directly on your local machine.

## Prerequisites

### Running with Docker

- [Docker](https://www.docker.com/get-started)

### Running without Docker

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (included with Node.js)
- [TypeScript](https://www.typescriptlang.org/) (if not globally installed, you can install it as a dev dependency)

## Setup Instructions

### 1. Clone the Repository

Clone this repository to your local machine using the following command:

```bash
git clone https://github.com/DuyHau3314/reachable-urls.git
```

### 3. Copy the Environment Variables
```bash
cp -p .env.example .env
```

# Running the Application

## Option 1: Running with Docker

### 1. Build and Run the Application
```bash
docker build -t backend:latest .
docker run -d -p 5000:5000 --name backend backend:latest
```

### 2. Stopping the Application
```bash
docker stop backend
```

### 3. Removing the Container
```bash
docker rm backend
```


## Option 2: Running without Docker

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Application 
```bash
npm run build
```

### 3. Run the Application
```bash
npm start
```

### 4. Running in Development Mode
```bash
npm run dev
```

### 4. Running Tests
```bash
npm run test
```



