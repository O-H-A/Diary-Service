import { SetMetadata } from '@nestjs/common';
import { UserGradeEnum } from '../enum/enum';

export const UserRole = (role: UserGradeEnum) => SetMetadata('roles', role);
