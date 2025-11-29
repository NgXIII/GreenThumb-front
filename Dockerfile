FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
RUN echo "VITE_API_URL=${VITE_API_URL}" > .env.production
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist .
RUN npm install -g http-server
EXPOSE 80
CMD ["http-server", "-p", "80"]