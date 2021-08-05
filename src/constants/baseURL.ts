const baseURL =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
    ? "http://localhost"
    : "http://34.127.71.40";

export default baseURL;
