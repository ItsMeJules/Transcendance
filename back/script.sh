#!/bin/bash

set -m

npx prisma migrate dev --name init &
npm run start:dev &
npx prisma studio

fg %1