import gql from 'graphql-tag';
import { OWNER, PROJECT } from '../../configs/constants';

export const sql = gql`query BlogDetail($number: Int!) {
  repository(owner: ${OWNER}, name: ${PROJECT}) {
    issue(number: $number) {
      title
      url
      bodyHTML
      updatedAt
      comments(first:100) {
        totalCount
        nodes {
          createdAt
          bodyHTML
          author {
            login
            avatarUrl
          }
        }
      }
      reactions(first: 100) {
        totalCount
        nodes {
          content
        }
      }
    }
    last: issues(last: 1, before: "Y3Vyc29yOnYyOpK5MjAxOS0xMC0wM1QyMjo1Mjo1MSswODowMM4d7bB-", orderBy: {
      field: CREATED_AT
      direction: DESC
    }, filterBy: {
      createdBy: "closertb"
    }) {
      edges {
        cursor
        node {
          title
          url
        }
      }
    }
    next: issues(first: 1, after: "Y3Vyc29yOnYyOpK5MjAxOS0xMC0wM1QyMjo1Mjo1MSswODowMM4d7bB-", orderBy: {
      field: CREATED_AT
      direction: DESC
    }, filterBy: {
      createdBy: "closertb"
    }) {
      edges {
        cursor
        node {
          title
          url
        }
      }
    }
  }
}`;
