#!/bin/bash

set -m

npx prisma migrate dev --name new &
npx prisma migrate deploy &
npm run start:dev &
npx prisma studio

fg %1