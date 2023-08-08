#!/bin/bash

# set -m

# npx prisma migrate dev --name init
# # npx prisma migrate deploy &
# npm run start:dev &
# npx prisma studio

# fg %1

set -m

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Start NestJS app in watch mode
npm run start:dev &

npx prisma studio

fg %1