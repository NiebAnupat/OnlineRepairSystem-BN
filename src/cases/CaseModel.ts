import { Status } from "./Status";
import { ImageDUO } from "./ImageModule/imageModel";

export default interface Case {
  [x: string]: any;
  user_id: string;
  status_id: Status;
  tec_id: string | null;
  name_case: string;
  detail_case: string;
  place_case: string;
  date_case: Date;
  date_assign: Date | null;
  date_sent: Date | null;
  date_close: Date | null;
  images: ImageDUO[];
}

export interface CaseDUO {
  name_case: string;
  detail_case: string;
  place_case: string;
  date_case: Date | string;
  users_cases_user_idTousers: {
    connect: {
      user_id: string;
    };
  };
  statuses: {
    connect: {
      status_id: Status;
    };
  };
  images: {
    createMany: {
      data: ImageDUO[];
    };
  };
}
