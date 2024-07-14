import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.7;
const VISIBLE_CARD_HEIGHT = 300;
const DRAG_THRESHOLD = 100;

export default function ParallaxScrollView() {
  const translateY = useSharedValue(0);
  const isHidden = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: { startY: number }) => {
      context.startY = translateY.value;
    },
    onActive: (event, context) => {
      if (isHidden.value) {
        // When hidden, only allow upward movement
        translateY.value = Math.min(
          context.startY + event.translationY,
          SCREEN_HEIGHT - VISIBLE_CARD_HEIGHT
        );
      } else {
        // When visible, only allow downward movement
        translateY.value = Math.max(context.startY + event.translationY, 0);
      }
    },
    onEnd: (event) => {
      if (isHidden.value) {
        if (SCREEN_HEIGHT - VISIBLE_CARD_HEIGHT - translateY.value > DRAG_THRESHOLD) {
          // If dragged up more than threshold, show the card
          translateY.value = withTiming(0);
          isHidden.value = false;
        } else {
          // Otherwise, keep it hidden
          translateY.value = withTiming(SCREEN_HEIGHT - VISIBLE_CARD_HEIGHT);
        }
      } else {
        if (translateY.value > DRAG_THRESHOLD) {
          // If dragged down more than threshold, hide the card
          translateY.value = withTiming(SCREEN_HEIGHT - VISIBLE_CARD_HEIGHT);
          isHidden.value = true;
        } else {
          // Otherwise, keep it visible
          translateY.value = withTiming(0);
        }
      }
    },
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={styles.cardContent}>
          {/* Your card content goes here */}
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: CARD_HEIGHT,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  cardContent: {
    flex: 1,
    padding: 20,
  },
});