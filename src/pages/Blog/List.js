import React from 'react';
import { Link } from 'react-router-dom';
import { DateFormat } from '../../configs/utils';

export default function List({ totalCount = 0, edges = [] }) {
  if (totalCount === 0) {
    return (<div className="no-content">暂无文章</div>);
  }
  const isShowAction = ((query = '') => {
    const show = query.split('&').find(item => item.includes('show'));
    return show ? show.split('=')[1] === 'true' : false;
  })(typeof window !== 'undefined' ? window.location.href.split('?')[1] : '');
  return (
    <div className="list-wrapper">
      <ul>
        {edges.map(({ cursor, node: { title, url, createdAt, reactions = {} } }) => (
          <li className="block" key={url}>
            <h4 className="title">
              <Link to={`/blog/${url.replace(/.*issues\//, '')}?cursor=${cursor}`}>{title}</Link>
            </h4>
            <div className="info">
              <div className="reactions">
                <a href={url} target="_blank" rel="noopener noreferrer">Issue链接</a>
                {isShowAction && !!reactions.totalCount && <span className="action">互动：{reactions.totalCount}</span>}
              </div>
              <span className="create-time">
                {DateFormat(createdAt)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>);
}
