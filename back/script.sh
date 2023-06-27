#!/bin/bash

set -m

npm run start:dev &
npx prisma studio

fg %1