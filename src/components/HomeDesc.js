/**
 * Title:
 * @author Mr Denzel
 * @create Date 2018-02-03 22:17
 * @version 1.0
 * Description:
 */
import React from 'react';

export default class HomeDesc extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { name } = this.props;
    return (
      <div style={{ textAlign: 'center' }}>
        Beautiful
        {name}
        Beautiful
      </div>
    );
  }
}
