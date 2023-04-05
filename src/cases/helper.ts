import Case, { CaseDUO } from "./CaseModel";
export const toCaseDUO = (obj: Case): CaseDUO => {
  const {
    name_case,
    detail_case,
    place_case,
    date_case,
    user_id,
    status_id,
    images,
  } = obj;
  return {
    name_case,
    detail_case,
    place_case,
    date_case,
    users_cases_user_idTousers: {
      connect: {
        user_id,
      },
    },
    statuses: {
      connect: {
        status_id,
      },
    },
    images: {
      createMany: {
        data: images,
      },
    },
  };
};
