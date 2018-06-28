import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  const tron = Reactotron
    .configure({ host: '192.168.43.134' })
    .useReactNative()
    .connect();

  tron.clear();

  console.tron = tron;
}
