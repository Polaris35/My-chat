import { GoogleGuard } from './google.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { WebsocketJwtGuard } from './ws-jwt.guard';

export const GUARDS = [JwtAuthGuard, GoogleGuard, WebsocketJwtGuard];
