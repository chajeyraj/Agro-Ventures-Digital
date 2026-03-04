import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Platform, ScrollView } from 'react-native';
import { COLORS } from '../theme';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

interface LayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, scrollable = true }) => {
  const Content = scrollable ? ScrollView : View;
  const Wrapper = Platform.OS === 'web' ? View : SafeAreaView;

  return (
    <View style={styles.outerContainer}>
      <Wrapper style={styles.container}>
        <ExpoStatusBar style="light" />
        <View style={styles.background}>
          <View style={styles.circle1} />
          <View style={styles.circle2} />
        </View>
        <Content 
          style={styles.content}
          contentContainerStyle={scrollable ? styles.scrollContent : undefined}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </Content>
      </Wrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  circle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.primary,
    opacity: 0.1,
  },
  circle2: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.darkOlive,
    opacity: 0.1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
});
