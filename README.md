# People Frontend

A modern, secure Angular web application for managing people data. This project serves as the frontend interface for the [People API](https://github.com/mcqueide/people-api) backend service.

## 🏗️ Architecture

This is the **frontend component** of a full-stack people management system:
- **Frontend**: Angular 21 single-page application (this repository)
- **Backend**: Spring Boot REST API ([people-api](https://github.com/mcqueide/people-api))

## 🛠️ Technology Stack

### Core Technologies
- **Angular 21.0** - Modern web framework with standalone components
- **TypeScript 5.9** - Strongly typed JavaScript
- **Angular Material 21.0** - Material Design UI components
- **RxJS 7.8** - Reactive programming library

### Build & Development Tools
- **Angular CLI 21.0** - Command-line interface for Angular
- **Vite 7.2** - Fast build tool and dev server
- **Vitest 4.0** - Unit testing framework
- **Node.js 24.12** - JavaScript runtime

### Production Server
- **Express 5.2** - Node.js web server
- **Winston 3.19** - Structured logging
- **http-proxy-middleware 3.0** - API proxy for backend communication

### DevOps & Security
- **Docker** - Containerization
- **Kubernetes** - Container orchestration
- **GitHub Actions** - CI/CD pipeline
- **Docker Scout** - Vulnerability scanning
- **Cosign** - Container image signing

## 📁 Project Structure

```
people-frontend/
├── src/
│   ├── app/
│   │   ├── models/          # Data models
│   │   ├── pages/           # Page components
│   │   │   ├── people-form/ # Create/Edit person
│   │   │   └── people-list/ # List people
│   │   ├── services/        # API services
│   │   ├── app.config.ts    # Application configuration
│   │   ├── app.routes.ts    # Route definitions
│   │   └── app.ts           # Root component
│   ├── custom-theme.scss    # Material Design theme
│   ├── main.ts              # Application entry point
│   └── styles.css           # Global styles
├── .k8s/
│   └── frontend/
│       ├── deployment.yaml  # Kubernetes deployment
│       └── service.yaml     # Kubernetes service
├── .github/
│   └── workflows/
│       └── ci.yaml          # CI/CD pipeline
├── server.js                # Production Express server
├── Dockerfile               # Multi-stage Docker build
├── compose.yaml             # Docker Compose configuration
└── package.json             # Dependencies and scripts
```

## 🔧 Prerequisites

### Local Development
- **Node.js** 24.12 or higher
- **npm** 11.6.2 or higher
- **Angular CLI** 21.0 or higher (optional)

### Production Deployment
- **Docker** 20.10 or higher
- **Kubernetes** 1.25 or higher (for orchestration)
- **kubectl** configured for your cluster

### Backend Service
- The [People API](https://github.com/mcqueide/people-api) backend service must be running and accessible

## 🚀 Getting Started

### Development Mode

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mcqueide/people-frontend.git
   cd people-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Set `API_URL` to your backend API endpoint

4. **Start the development server:**
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200/`

### Production Build

Build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Production Server

Run the production Express server:

```bash
npm run start:prod
```

The server will start on port 3000 and serve the built application with API proxying.

## 🧪 Testing

Run unit tests with Vitest:

```bash
npm test
```

## 🐳 Docker Deployment

### Using Docker Compose

1. **Build and run:**
   ```bash
   docker compose up -d
   ```

2. **Access the application:**
   - The app runs on port 3000 (internal)
   - Configure your reverse proxy to route traffic

### Building Docker Image

```bash
docker build -t mcqueide/people-frontend:latest .
```

### Multi-stage Dockerfile Features
- **Base stage**: Node.js 24.12 Alpine with updated npm
- **Deps stage**: Production dependencies installation
- **Build stage**: Application compilation with dev dependencies
- **Final stage**: Minimal runtime with only necessary files
- **Security**: Runs as non-root user, minimal attack surface
- **Size**: ~66 MB optimized image

## ☸️ Kubernetes Deployment

### Prerequisites
- Kubernetes cluster configured
- kubectl access
- Backend API deployed and accessible

### Deploy to Kubernetes

1. **Configure environment variables:**
   ```bash
   cd .k8s/frontend
   cp env.yaml.example env.yaml
   # Edit env.yaml and update API_URL and other variables as needed
   ```

2. **Apply Kubernetes manifests:**
   ```bash
   kubectl apply -f .k8s/frontend/
   ```

### Kubernetes Resources

**Deployment** (`.k8s/frontend/deployment.yaml`):
- 3 replicas for high availability
- Resource limits: 256Mi memory, 0.5 CPU
- Resource requests: 128Mi memory, 0.25 CPU
- Security hardening:
  - Runs as non-root (UID 1000)
  - No privilege escalation
  - All capabilities dropped
  - seccomp profile applied

**Service** (`.k8s/frontend/service.yaml`):
- Type: ClusterIP
- Port: 3000
- Internal cluster communication

### Scaling

Scale the deployment:
```bash
kubectl scale deployment people-frontend --replicas=5
```

### Monitoring

Check deployment status:
```bash
kubectl get pods -l app=people-frontend
kubectl logs -l app=people-frontend --tail=100
```

## 🔐 Security Features

### CI/CD Pipeline Security

The GitHub Actions workflow (`.github/workflows/ci.yaml`) implements comprehensive security measures:

#### 1. **Vulnerability Scanning**
- **Docker Scout CVE Analysis**: Scans for critical and high severity vulnerabilities
- **Only Fixed CVEs**: Fails build if fixable vulnerabilities exist
- **SARIF Upload**: Sends security results to GitHub Security tab
- **Pull Request Summaries**: Automatic security reports on PRs

#### 2. **Container Image Signing**
- **Cosign v2.2.4**: Signs published images using keyless signing
- **OIDC Authentication**: Uses GitHub's OIDC provider for verification
- **Provenance**: Full build provenance metadata included
- **SBOM**: Software Bill of Materials generated and attached

#### 3. **Build Security**
- **Provenance mode=max**: Maximum build attestation detail
- **Layer caching**: GitHub Actions cache for faster, reproducible builds
- **Multi-arch support**: Buildx configuration ready

#### 4. **Image Verification**

Verify a signed image:
```bash
# Install cosign
curl -O -L "https://github.com/sigstore/cosign/releases/download/v2.2.4/cosign-linux-amd64"
sudo mv cosign-linux-amd64 /usr/local/bin/cosign
sudo chmod +x /usr/local/bin/cosign

# Verify image signature
cosign verify mcqueide/people-frontend:v1.1.0 \
  --certificate-identity-regexp="https://github.com/mcqueide/people-frontend" \
  --certificate-oidc-issuer="https://token.actions.githubusercontent.com"
```

### Runtime Security

**Container Security**:
- Non-root user execution (UID 1000)
- Read-only root filesystem compatible
- No privilege escalation allowed
- All Linux capabilities dropped
- Seccomp profile applied

**Docker Compose Security**:
- `no-new-privileges:true` security option
- All capabilities dropped
- Resource limits enforced
- Internal network isolation

## 📦 Continuous Integration

The CI/CD pipeline automatically:

1. **On Pull Requests:**
   - Builds the Docker image
   - Scans for critical/high CVEs (fails if found)
   - Posts security summary to PR

2. **On Push to Main:**
   - Performs all PR checks
   - Uploads SARIF report to GitHub Security
   - Builds and pushes signed images
   - Tags images with commit SHA and version

3. **On Version Tags (v*.*.*):**
   - Creates semantic version release
   - Publishes versioned Docker images
   - Signs images with Cosign
   - Generates SBOM and provenance

### Image Tags

Published images use multiple tags:
- `v1.0.0` - Semantic version
- `abc1234` - Git commit SHA
- `latest` - Latest main branch

## 🔗 Backend Integration

This frontend communicates with the [People API](https://github.com/mcqueide/people-api) backend through:

1. **Development**: Angular proxy configuration (`proxy.conf.json`)
2. **Production**: Express server proxy (`server.js`)
3. **Kubernetes**: Service-to-service communication via ClusterIP

Configure the backend URL via the `API_URL` environment variable.

## 📚 Additional Resources

- [Angular CLI Reference](https://angular.dev/tools/cli)
- [Angular Material Components](https://material.angular.io/components)
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Cosign Documentation](https://docs.sigstore.dev/cosign/overview/)
- [Backend API Repository](https://github.com/mcqueide/people-api)

## 📝 License

This project is part of a demonstration application showcasing modern cloud-native development practices.