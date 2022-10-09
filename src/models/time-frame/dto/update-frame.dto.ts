import { PartialType } from '@nestjs/swagger';
import { CreateFrameDTO } from './create-frame.dto';

export class UpdateTimeFrameDTO extends PartialType(CreateFrameDTO) {}
