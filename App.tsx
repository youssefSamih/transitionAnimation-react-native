import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  block,
  Clock,
  cond,
  Easing,
  interpolate,
  neq,
  not,
  set,
  startClock,
  stopClock,
  timing,
  Value,
} from 'react-native-reanimated';
import {Button, Card, cards, CARD_WIDTH} from './components';

const alpha = Math.PI / 6;
const App = () => {
  const [toggled, settoggled] = useState(false);
  const useConst = (initialValue: Function) => {
    const ref = useRef<{value: any}>();
    if (ref.current === undefined) {
      ref.current = {
        value:
          typeof initialValue === 'function'
            ? (initialValue as Function)()
            : initialValue,
      };
    }
    return ref.current?.value;
  };
  const withTransition = (
    value: Animated.Node<number>,
    timingConfig: Animated.TimingConfig,
  ) => {
    const init = new Value(0);
    const clock = new Clock();
    const state = {
      finished: new Value(0),
      frameTime: new Value(0),
      position: new Value(0),
      time: new Value(0),
    };
    const config = {
      toValue: new Value(0),
      duration: 150,
      easing: Easing.linear,
      ...timingConfig,
    };
    return block([
      cond(not(init), [set(init, 1), set(state.position, value)]),
      cond(neq(config.toValue, value), [
        set(state.frameTime, 0),
        set(state.time, 0),
        set(state.finished, 0),
        set(config.toValue, value),
        startClock(clock),
      ]),
      timing(clock, state, config),
      cond(state.finished, stopClock(clock)),
      state.position,
    ]);
  };
  const useTransition = (
    state: boolean | number,
    config: Partial<Omit<Animated.TimingConfig, 'toValue'>>,
  ) => {
    const value: Animated.Value<number> = useConst(() => new Value(0));
    useEffect(() => {
      value.setValue(typeof state === 'boolean' ? (state ? 1 : 0) : state);
    }, [state, value]);
    const transition = useConst(() => withTransition(value, config));
    return transition;
  };
  const transitions = useTransition(toggled, {duration: 400});
  return (
    <View style={styles.container}>
      {cards.slice(0, 3).map((card, index) => {
        const rotate = interpolate(transitions, {
          inputRange: [0, 1],
          outputRange: [0, (index - 1) * alpha],
        });
        return (
          <Animated.View
            key={card}
            style={[
              styles.overlay,
              {
                transform: [
                  {translateX: -CARD_WIDTH / 2},
                  {rotate},
                  {translateX: CARD_WIDTH / 2},
                ],
              },
            ]}>
            <Card {...{card}} />
          </Animated.View>
        );
      })}
      <Button
        label={toggled ? 'Reset' : 'Start'}
        primary
        onPress={() => settoggled((prev) => !prev)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
});

export default App;
