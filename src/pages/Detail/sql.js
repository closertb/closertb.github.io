import gql from 'graphql-tag';
import { OWNER, PROJECT } from '../../configs/constants';

/**
 * @param: number 文章索引编号
 * @param: cursor 当前文章标识，用于查上一篇，下一篇
 */
export const sql = gql`query BlogDetail($number: Int!, $cursor: String) {
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
    last: issues(last: 1, before: $cursor, orderBy: {
      field: CREATED_AT
      direction: DESC
    }, filterBy: {
      createdBy: ${OWNER}
    }) {
      edges {
        cursor
        node {
          title
          url
        }
      }
    }
    next: issues(first: 1, after: $cursor, orderBy: {
      field: CREATED_AT
      direction: DESC
    }, filterBy: {
      createdBy: ${OWNER}
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
