import React from 'react';
import { StyleSheet, Dimensions, FlatList, Animated } from 'react-native';
import { Block, theme } from 'galio-framework';
import { appTheme } from '../../constants/examples';

const { width } = Dimensions.get('screen');

const defaultMenu = [
  { id: 'popular', title: 'Popular' },
  { id: 'beauty', title: 'Beauty' },
  { id: 'cars', title: 'Cars' },
  { id: 'motocycles', title: 'Motocycles' },
];

const styles = StyleSheet.create({
  container: {
    width,
    backgroundColor: theme.COLORS.WHITE,
    zIndex: 2,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 4,
  },
  menu: {
    paddingHorizontal: theme.SIZES.BASE * 2.5,
    paddingTop: 8,
    paddingBottom: 16,
  },
  titleContainer: {
    alignItems: 'center',
    backgroundColor: appTheme.COLORS.ACTIVE,
    borderRadius: 4,
    marginRight: 9,
  },
  containerShadow: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 1,
  },
  menuTitle: {
    fontWeight: '600',
    fontSize: 14,
    // lineHeight: 28,
    paddingVertical: 10,
    paddingHorizontal: 16,
    color: appTheme.COLORS.MUTED,
  },
});

class Tabs extends React.Component {
  constructor() {
    super();

    this.state = {
      active: null,
    };

    this.animatedValue = new Animated.Value(1);

    this.menuRef = React.createRef();
  }

  componentDidMount() {
    const { initialIndex } = this.props;
    if (initialIndex) this.selectMenu(initialIndex);
  }

  animate() {
    this.animatedValue.setValue(0);

    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false, // color not supported
    }).start();
  }

  onScrollToIndexFailed() {
    this.menuRef.current.scrollToIndex({
      index: 0,
      viewPosition: 0.5,
    });
  }

  selectMenu(id) {
    this.setState({ active: id });

    this.menuRef.current.scrollToIndex({
      index: this.props.data.findIndex((item) => item.id === id),
      viewPosition: 0.5,
    });

    this.animate();
    if (this.props.onChange) this.props.onChange(id);
  }

  renderItem(item) {
    const isActive = this.state.active === item.id;

    const textColor = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [appTheme.COLORS.BLACK, isActive ? appTheme.COLORS.WHITE : appTheme.COLORS.BLACK],
      extrapolate: 'clamp',
    });

    const containerStyles = [
      styles.titleContainer,
      !isActive && { backgroundColor: appTheme.COLORS.SECONDARY },
      isActive && styles.containerShadow,
    ];

    return (
      <Block style={containerStyles}>
        <Animated.Text
          style={[
            styles.menuTitle,
            { color: textColor },
          ]}
          onPress={() => this.selectMenu(item.id)}>
          {item.title}
        </Animated.Text>
      </Block>
    );
  }

  renderMenu() {
    const { data, ...props } = this.props;

    return (
      <FlatList
        {...props}
        data={data}
        horizontal={true}
        ref={this.menuRef}
        extraData={this.state}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        onScrollToIndexFailed={this.onScrollToIndexFailed}
        renderItem={({ item }) => this.renderItem(item)}
        contentContainerStyle={styles.menu}
      />
    );
  }

  render() {
    return (
      <Block style={styles.container}>
        {this.renderMenu()}
      </Block>
    );
  }
}

Tabs.defaultProps = {
  data: defaultMenu,
  initialIndex: null,
};

export default Tabs;
