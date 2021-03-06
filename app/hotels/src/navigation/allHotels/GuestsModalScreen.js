// @flow

import * as React from 'react';
import {
  type NavigationType,
  HeaderTitle,
} from '@kiwicom/react-native-app-navigation';
import {
  Touchable,
  Text,
  StyleSheet,
  Color,
} from '@kiwicom/react-native-app-shared';
import { Translation } from '@kiwicom/react-native-app-localization';
import { connect } from '@kiwicom/react-native-app-redux';

import type { HotelsReducerState } from '../../HotelsReducer';
import type {
  RoomConfigurationType as Guests,
  OnChangeSearchParams,
} from '../../allHotels/searchForm/SearchParametersType.js';
import type {
  RoomConfigurationType as UnsavedRoomConfigurationType,
  ChildAge,
} from '../../allHotels/searchForm/guests/GuestsTypes';
import GuestsModal from '../../allHotels/searchForm/guests/GuestsModal';

const styles = StyleSheet.create({
  headerButton: {
    padding: 8,
  },
  headerButtonText: {
    color: Color.white,
    fontSize: 17,
  },
  saveButtonText: {
    fontWeight: '600',
  },
});

type Props = {|
  navigation: NavigationType,
  guests: Guests,
  searchChange: (search: OnChangeSearchParams) => void,
|};

type NavigationProps = {|
  navigation: NavigationType,
|};

type State = {|
  guests: UnsavedRoomConfigurationType,
  isMissingAge: boolean,
|};

export class GuestsModalScreen extends React.Component<Props, State> {
  state = {
    guests: {
      adultsCount: 0,
      children: [],
    },
    isMissingAge: false,
  };

  static navigationOptions = ({ navigation }: NavigationProps) => {
    function goBack() {
      navigation.goBack();
    }

    function onSave() {
      navigation.state.params.onSave();
    }

    return {
      headerLeft: (
        <Touchable
          borderlessRipple={true}
          onPress={goBack}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>
            <Translation id="hotels_search.guests_modal.close" />
          </Text>
        </Touchable>
      ),
      title: (
        <HeaderTitle>
          <Translation id="hotels_search.guests_modal.header" />
        </HeaderTitle>
      ),
      headerRight: (
        <Touchable
          borderlessRipple={true}
          onPress={onSave}
          style={styles.headerButton}
        >
          <Text style={[styles.headerButtonText, styles.saveButtonText]}>
            <Translation id="hotels_search.guests_modal.save" />
          </Text>
        </Touchable>
      ),
    };
  };

  componentDidMount = () => {
    this.setState({
      guests: ((this.props.guests: any): UnsavedRoomConfigurationType),
    });
    this.props.navigation.setParams({ onSave: this.onSave });
  };

  isMissingAge = (children: ChildAge[]) => {
    return children.some(child => child.age === null);
  };

  handleAdultChange = (adultsCount: number) => {
    this.setState(state => ({
      guests: {
        adultsCount,
        children: state.guests.children,
      },
    }));
  };

  handleChildrenChange = (number: number) => {
    const children = [...this.state.guests.children];
    if (children.length < number) {
      // Incremented
      children.push({ age: null });
    } else {
      // Decremented
      children.pop();
    }

    this.setState(({ guests, isMissingAge }) => ({
      guests: {
        adultsCount: guests.adultsCount,
        children,
      },
      // Adding children should never produce an error, but it can remove an error
      isMissingAge: this.isMissingAge(children) ? isMissingAge : false,
    }));
  };

  handleChildrenAgesChange = (children: ChildAge[]) => {
    this.setState(({ guests, isMissingAge }) => ({
      guests: {
        adultsCount: guests.adultsCount,
        children,
      },
      // Adding children age should never produce an error, but it can remove an error
      isMissingAge: this.isMissingAge(children) ? isMissingAge : false,
    }));
  };

  onSave = () => {
    if (this.isMissingAge(this.state.guests.children)) {
      this.setState({ isMissingAge: true });
    } else {
      this.props.searchChange({ roomsConfiguration: this.state.guests });
      this.props.navigation.goBack();
    }
  };

  render = () => (
    <GuestsModal
      guests={this.state.guests}
      isMissingAge={this.state.isMissingAge}
      handleAdultChange={this.handleAdultChange}
      handleChildrenChange={this.handleChildrenChange}
      handleChildrenAgesChange={this.handleChildrenAgesChange}
    />
  );
}

const select = ({ hotels }: { hotels: HotelsReducerState }) => ({
  guests: hotels.searchParams.roomsConfiguration,
});

const action = dispatch => ({
  searchChange: (search: OnChangeSearchParams) =>
    dispatch({
      type: 'setSearch',
      search,
    }),
});

export default connect(select, action)(GuestsModalScreen);
