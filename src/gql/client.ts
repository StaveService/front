import { GraphQLClient } from "graphql-request";

let url;
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
