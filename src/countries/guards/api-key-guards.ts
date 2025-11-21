import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    const token = req.headers['x-api-key'];

    if (token !== 'PREPARCIAL2025') {
      throw new ForbiddenException('No autorizado. Proporcione x-api-key.');
    }

    return true;
  }
}
