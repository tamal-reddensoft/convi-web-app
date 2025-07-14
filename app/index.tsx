
import React from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, BackHandler, Alert } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import type { WebView as WebViewType } from 'react-native-webview';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export default function Index() {

  const webViewRef = useRef<WebViewType>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [webUrl, setWebUrl] = useState('https://app.convi.co.il');
  const expoPushToken = usePushNotifications();

  const onRefresh = () => {
    setRefreshing(true);
    webViewRef.current?.reload();
    setTimeout(() => setRefreshing(false), 1000);
  };

  // useEffect(() => {
  //   if (expoPushToken) {
  //     console.log('📲 Expo Push Token:', expoPushToken);
  //     // Optionally alert it
  //     Alert.alert('Expo Push Token', expoPushToken);
  //   }

  //   Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: '👋 Welcome!',
  //       body: 'Thanks for using our Convi APP! 😊',
  //       data: { url: 'https://convi-app.vercel.app' },
  //     },
  //     trigger: null,
  //   });
  // }, [expoPushToken]);



  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, []);




  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
      <WebView 
        ref={webViewRef}
        source={{ uri: webUrl }}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
        renderLoading={() => (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
        )}
        style={styles.webview}
      />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
});
