const baseURL =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
    ? "https://localhost"
    : "https://stave-service.com";

export default baseURL;
