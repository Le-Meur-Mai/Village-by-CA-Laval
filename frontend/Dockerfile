FROM node:20
WORKDIR /app
COPY villageByCa/package*.json ./
RUN npm install
COPY villageByCa/ .
EXPOSE 5173
CMD ["npm", "run", "dev"]