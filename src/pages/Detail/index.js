import React from 'react';
import { Link } from 'react-router-dom';
import QueryWithLoading from 'components/QueryWithLoading';
import { DateFormat } from 'configs/utils';
import { sql } from './sql';
import style from './index.less';

function RelateLink({ data, className }) {
  const { edges = [] } = data;
  if (edges.length === 0) {
    return null;
  }
  const { cursor, node: { title, url } } = edges[0];
  return (<Link className={className} to={`/blog/${url.replace(/.*issues\//, '')}?cursor=${cursor}`}>{title}</Link>);
}
export default function BlogDetail({ location: { pathname, search = '' } }) {
  const number = pathname.replace('/blog/', '');
  if (typeof number !== 'string' && typeof +number !== 'number') {
    return <div className="content-waring">路径无效</div>;
  }
  // 提取cursor
  const cursor = search ?
    search.slice(1).split('&').find(item => item.includes('cursor=')).replace('cursor=', '') :
    undefined;

  const param = { number: +number, cursor };
  // const { loading, error, data = {} } = useQuery(query({ number }));
  return (
    <QueryWithLoading sql={sql} query={param}>
      {({ repository: { issue: { title, url, bodyHTML, updatedAt }, last = {}, next = {} } }) => (
        <div className={style.Detail}>
          <div className="header">
            <h3 className="title">{title}</h3>
            <div className="info">
              <a href={url} target="_blank" rel="noopener noreferrer">Issue链接</a>
              <span>更新于：{DateFormat(updatedAt)}</span>
            </div>
          </div>
          <div className="markdown-body" dangerouslySetInnerHTML={{ __html: bodyHTML }} />
          <div className="page-jump">
            <RelateLink data={last} className="last" />
            <RelateLink data={next} className="next" />
          </div>
        </div>
      )}
    </QueryWithLoading>
  );
}
