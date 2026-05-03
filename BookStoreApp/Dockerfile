# -------- Build stage --------
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# -------- Runtime stage --------
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Add your config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ✅ Correct path (NO browser)
COPY --from=build /app/dist/book-store-app /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]