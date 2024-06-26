import { SetMetadata } from '@nestjs/common';
import { UserGradeEnum } from 'src/common/enum/enum';

export const UserRole = (role: UserGradeEnum) => SetMetadata('roles', role);
