import { gql } from "graphql-request";

const issuesQuery = gql`
  query getIssues($musicId: Int!, $page: Int!) {
    issues(musicId: $musicId, page: $page) {
      pagination {
        totalPages
      }
      data {
        id
        title
        description
      }
    }
  }
`;
export default issuesQuery;
