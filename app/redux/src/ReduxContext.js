// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { type Reducer } from 'redux';

import Store, { createCombinedReducer } from './Store';

type Props = {|
  children: React.Node,
  reducers: { [string]: Reducer },
|};

/**
 * Creates Redux context for underlying components. It makes only sense if
 * you pass additional reducers to be registered.
 */
export default class ReduxContext extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    // reducers must be connected before rendering phase
    Object.entries(this.props.reducers).map(([reducerName, reducerItself]) => {
      return (Store.asyncReducers[reducerName] = reducerItself);
    });
    Store.replaceReducer(createCombinedReducer(Store.asyncReducers));
  }

  getChildContext() {
    return {
      reduxProviderMounted: true,
    };
  }

  /**
   * It prepares Redux provider. These HOC components are created only
   * once in the components tree which means that you can nest
   * ReduxContext components.
   */
  render = () => {
    if (this.context.reduxProviderMounted === true) {
      return this.props.children;
    }

    return <Provider store={Store}>{this.props.children}</Provider>;
  };
}

ReduxContext.childContextTypes = {
  reduxProviderMounted: PropTypes.bool,
};

ReduxContext.contextTypes = {
  reduxProviderMounted: PropTypes.bool,
};
