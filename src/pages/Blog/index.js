import React, { useState, useRef, useCallback } from 'react';
import { PAGE_SIZE } from 'configs/constants';
import QueryWithLoading from 'components/QueryWithLoading';
import { sql } from './sql';
import List from './List';
import style from './index.less';


export default function Blog() {
  const [param, setParam] = useState({ pageFirst: PAGE_SIZE, current: 1 });
  const pageRef = useRef();
  const setCursorBack = useCallback((data) => {
    const { repository: { issues: { edges } } } = data;
    pageRef.current = {
      pageBefore: edges[0].cursor,
      pageAfter: edges[edges.length - 1].cursor
    };
  });
  const setNextPage = useCallback(dir => () => {
    const { pageAfter, pageBefore } = pageRef.current;
    // dir: true 为向下， false 为向上
    setParam(dir ?
      { pageFirst: PAGE_SIZE, pageAfter, current: param.current + 1 } :
      { pageLast: PAGE_SIZE, pageBefore, current: param.current - 1 });
  });
  const { current, ...query } = param;
  return (
    <QueryWithLoading sql={sql} query={query} callback={setCursorBack}>
      {({ repository: { issues = {} } }) => (
        <div className={style.List}>
          <List {...issues} />
          <div className="page-jump">
            {current !== 1 && <a className="last" onClick={setNextPage(false)}>上一页</a>}
            {current < (issues.totalCount / PAGE_SIZE) && <a className="next" onClick={setNextPage(true)}>下一页</a>}
          </div>
        </div>
      )}
    </QueryWithLoading>
  );
}
