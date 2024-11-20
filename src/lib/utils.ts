export const parseError = (error: unknown) => {
  switch (error) {
    case 401:
      return "Unauthorized";

    case 403:
      return "Forbidden";

    case 404:
      return "Not Found";

    case 500:
      return "Internal Server Error";

    default:
      return "Something went wrong";
  }
};
