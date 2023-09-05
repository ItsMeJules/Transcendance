import { BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

function handlePrismaError(error: any) {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new BadRequestException('Credentials taken');
      case 'P2025':
        throw new NotFoundException('Record not found');
    }
  }
}

export default handlePrismaError;