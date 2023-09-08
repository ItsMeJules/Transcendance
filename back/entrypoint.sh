#!/bin/bash

set -m

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Start NestJS app in watch mode
npm run start &

npx prisma studio

fg %1