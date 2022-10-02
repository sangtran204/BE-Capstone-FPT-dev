import { PartialType } from '@nestjs/swagger';
import { CreatePackageDTO } from './create-package.dto';

export class UpdatePackageDTO extends PartialType(CreatePackageDTO) {}
