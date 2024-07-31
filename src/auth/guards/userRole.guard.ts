import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserGradeEnum } from '../../common/enum/enum';

@Injectable()
export class UserRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requireRole = this.reflector.get<UserGradeEnum>('roles', context.getHandler());
    const { userGrade } = context.switchToHttp().getRequest().user;

    const userGradeList = Object.values(UserGradeEnum);
    const [loginUserRole, requireLevel] = [
      userGradeList.indexOf(UserGradeEnum[userGrade]),
      userGradeList.indexOf(requireRole),
    ];

    if (loginUserRole > requireLevel) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }

    return loginUserRole <= requireLevel;
  }
}
