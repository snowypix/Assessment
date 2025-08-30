
FROM node:20-alpine
ARG NEXT_PUBLIC_API
ENV NEXT_PUBLIC_API=$NEXT_PUBLIC_API
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
RUN npm run build -- --no-lint
CMD ["npm", "start"]