//  https://www.youtube.com/watch?v=:ID
//  https://www.youtube.com/channel/:ID

const getIDfromYoutubeURL = (url: string): string | null => {
  const newURL = new URL(url);
  const { pathname } = newURL;
  if (pathname.includes("watch")) return newURL.searchParams.get("v");
  if (pathname.includes("channel")) return pathname.split("/")[2];
  return null;
};

export default getIDfromYoutubeURL;
