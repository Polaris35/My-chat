import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const UserAgent = createParamDecorator(
    (_key: string, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        return request.headers['user-agent'];
    },
);
