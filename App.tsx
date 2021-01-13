import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated from 'react-native-reanimated';
import {Button, Card, cards} from './components';

const alpha = Math.PI / 2;
const App = () => {
  const [toggled, settoggled] = useState(false);
  return (
    <View style={styles.container}>
      {cards.slice(0, 3).map((card, index) => {
        const rotate = toggled ? (index - 1) * alpha : 0;
        return (
          <Animated.View
            key={card}
            style={[styles.overlay, {transform: [{rotate: `${rotate}rad`}]}]}>
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
