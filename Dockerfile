# create dockerfile for the application
FROM node:lts-alpine
WORKDIR /app

COPY package.json .
COPY tsconfig.json .
COPY prisma ./prisma

RUN npm install
RUN npx prisma generate
COPY . .

RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "start"]
