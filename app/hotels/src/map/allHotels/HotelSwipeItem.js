// @flow

import * as React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { TouchableWithoutFeedback, View } from 'react-native';
import idx from 'idx';

import HotelDetailPreview from '../HotelDetailPreview';
import type { HotelSwipeItem as HotelSwipeItemData } from './__generated__/HotelSwipeItem.graphql';

type ContainerProps = {|
  width: number,
  onPress: (hotelId: string) => void,
  data: $FlowFixMeProps,
|};

type Props = {
  ...ContainerProps,
  data: ?HotelSwipeItemData,
};

export class HotelSwipeItem extends React.Component<Props> {
  handlePress = () => {
    const { data } = this.props;
    const id = idx(data, _ => _.hotel.id);

    if (id) {
      this.props.onPress(id);
    }
  };

  render = () => {
    const { width, data } = this.props;

    return (
      <TouchableWithoutFeedback onPress={this.handlePress}>
        <View style={{ width }}>
          <HotelDetailPreview availability={data} />
        </View>
      </TouchableWithoutFeedback>
    );
  };
}

export default (createFragmentContainer(
  HotelSwipeItem,
  graphql`
    fragment HotelSwipeItem on HotelAvailability {
      ...HotelDetailPreview_availability
      hotel {
        id
      }
    }
  `,
): React.ComponentType<ContainerProps>);
