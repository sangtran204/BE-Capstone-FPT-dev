import { AutoMap } from '@automapper/classes';
import { ProfileDTO } from 'src/models/profiles/dto/profile.dto';

export class AccountDTO {
  @AutoMap()
  phone: string;

  @AutoMap(() => ProfileDTO)
  profile: ProfileDTO;
}
