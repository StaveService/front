//  http://example.com/:ID

const getIDfromURL = (url: string): string =>
  new URL(url).pathname.replace(/\//g, "");

export default getIDfromURL;
