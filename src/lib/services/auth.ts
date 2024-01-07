export const authErrorToText = (statusText: string) => {
  if (statusText === "Bad Request") {
    return "Попълнете полетата правилно";
  } else if (statusText === "Not Found" || statusText === "Unauthorized") {
    return "Не открихме акаунт с този имейл и парола";
  } else {
    return "Нещо се обърка опитайте отново";
  }
};
