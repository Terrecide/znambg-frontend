import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ locals }) => {
  return {
    user: locals.user,
  };
};
