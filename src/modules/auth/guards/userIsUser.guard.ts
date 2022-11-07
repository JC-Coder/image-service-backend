import { CanActivate, ExecutionContext, Injectable, Param } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class UserIsUserGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        return request.user.id == request.params.id;
    }

}