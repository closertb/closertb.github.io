import React, { useState, useCallback } from 'react';
import { Switch, Route, NavLink, Redirect } from 'react-router-dom';
import { SITE_NAME, SITE_MOTTO, LINK_ADDRESS, GITHUB_URL, GITHUB_FORK_IMG, ICP_CODE } from '../configs/constants';
import { Menu, Routes } from '../configs/menu';
import Pages from '../pages';
import styles from './index.less';

export default function Layout(props) {
  const [active, setActive] = useState(false);
  const { history: { location: { pathname } } } = props;
  // 移动端，关闭Menu
  const closeNav = useCallback(() => {
    setActive(false);
  });

  return (
    <div className={styles.Layout}>
      {false &&
        <h4 className="user-info">
          <span className="info-label">欢迎你：</span>
          <span className="info-con">DenzelT !</span>
        </h4>}
      {GITHUB_URL &&
      <a className="github-click" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
        <img alt="an ckick pictrue" src={GITHUB_FORK_IMG} />
      </a>}
      <header className="head">
        <h3 className="site">
          <div className="name">
            <span>{SITE_NAME}</span>
            <a href={LINK_ADDRESS} target="_blank" rel="noopener noreferrer">
              <img alt="segmentfault 专栏" src="https://doddle.oss-cn-beijing.aliyuncs.com/oldNotes/20200531231700.png" />
            </a>
          </div>
          <div className="address">
            <a href={LINK_ADDRESS} target="_blank" rel="noopener noreferrer">{SITE_MOTTO}</a>
          </div>
        </h3>
        <span className="menu-toggle" onClick={() => setActive(!active)} type="button" />
        <ul className={`${active ? 'active' : ''} layout-menu`}>
          {Menu.map(({ name, path }) =>
            // eslint-disable-next-line
            <li key={path}>
              <NavLink to={path} onClick={closeNav} activeClassName="selected">{name}</NavLink>
            </li>
          // eslint-disable-next-line function-paren-newline
          )}
        </ul>
      </header>
      <div className="content">
        <Switch>
          {Routes.map(({ path, component }) => (
            <Route exact key={path} path={path} component={Pages[component]} />
          ))}
          <Redirect from={pathname} to="/blog" />
        </Switch>
      </div>
      <footer className="foot">
        <div>
          Copyright © 2017-{new Date().getFullYear()} 吃饭不洗... |
          <a className="icp" href="http://www.beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
            {ICP_CODE}
          </a>
        </div>
        <div>
          <span id="busuanzi_container_site_pv">本站总访问量：<span id="busuanzi_value_site_pv" />次</span>
          <span className="pl-30" id="busuanzi_container_site_uv">访问人数：<span id="busuanzi_value_site_uv" />次</span>
        </div>
      </footer>
    </div>
  );
}
