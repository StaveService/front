const baseURL =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
    ? "http://localhost"
    : "http://stave-back.com";

export default baseURL;
