# 1. Base image (Lightweight Node.js)
FROM node:18-alpine

# 2. Container ke andar working directory set karein
WORKDIR /app

# 3. Dependencies list copy karein
COPY package*.json ./

# 4. Dependencies install karein
RUN npm install

# 5. Rest of backend code copy karein
COPY . .

# 6. Expose Backend Port (5000)
EXPOSE 5000

# 7. Start command
CMD ["npm", "start"]