import { GraphQLClient } from "graphql-request";

let url;
// eslint-disable-next-line no-console
console.log(process.env.NODE_ENV);
switch (process.env.NODE_ENV) {
  case "development":
    url = "http://localhost:3000";
    break;
  case "production":
    url = "https://stave-back.herokuapp.com";
    break;
  default:
    url = "http://localhost:3000";
}
const graphQLCilent = new GraphQLClient(`${url}/graphql`);
export default graphQLCilent;
