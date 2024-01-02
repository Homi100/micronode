# Nuvexa-Photos
A web App based on Microservices Architecture for uploading and deleting pictures
## Overview

This project is a full-stack application with a frontend built with React and a backend built with Node.js and Express.js. It's organized into several microservices, each with its own responsibilities, and uses MongoDB as the database. The project also includes Kubernetes configuration files for deploying the microservices.
### The project is deployed on GCP Kubernetes Cluster

## Structure

- `frontend/`: Contains the code for the frontend application built with React.
- `node/FrontendService/`: Contains the code for the FrontendService. This service handles the user interface and interactions.
- `node/LoggingService/`: Contains the code for the LoggingService. This service collects logs whenever users update, delete, or add images.
- `node/UsageMngService/`: Contains the code for the UsageMngService. This service monitors daily transactions and usage. and stores the data on mongo cloud atlas.
- `node/StorageMngService/`: Contains the code for the StorageMngService. This service ensures that no user can upload more than 10MB of storage.
- `node/PhotosMngService/`: Contains the code for the PhotosMngService. This service stores all the photos on Cloudinary.
- `node/UserMngService/`: Contains the code for the UserMngService. This service is responsible for managing user data.
- `node/infra/k8s/`: Contains Kubernetes configuration files for deploying the services.
- `node/Skaffold.yaml`: This file is used by Skaffold, a command-line tool that facilitates continuous development for Kubernetes applications. It automates the task of building and deploying applications to a Kubernetes cluster.

## Deployment

The `.yaml` files in the `node/infra/k8s/` directory are used to create deployments of the microservices. Each running container of a microservice is contained in a pod, and each deployment that is affiliated with a pod has a cluster IP service through which they communicate. The `ingress.yaml` file configures the Ingress controller, which directs outward traffic from the browser to specific cluster IP services according to the endpoint.
## CI/CD Configuration
# Microservices Project

This repository contains the source code for our microservices project.

## CI/CD Configuration

For Continuous Integration and Continuous Deployment (CI/CD), we are using Skaffold, a tool for streamlining the development workflow for Kubernetes applications.

### Build Process

Our CI/CD pipeline is configured with Skaffold to perform the following tasks:

1. **Building Docker Images:** Skaffold is set up to build Docker images for each microservice in this project.

2. **Continuous Integration:** We have integrated Skaffold into our CI workflow, ensuring that code changes trigger automated builds and tests.

### Deployment Process

Skaffold facilitates the deployment of our microservices to a Kubernetes cluster. The deployment configuration is stored in the `skaffold.yaml` file.

To deploy the microservices locally, run the following command:

```skaffold dev -v debug (please refer to other commands in skaffold documentation)```

## Getting Started

Each service has its own `Dockerfile` for building a Docker image. You can build and run each service individually, or use the Kubernetes configuration files in `node/infra/k8s/` to deploy the entire application.

