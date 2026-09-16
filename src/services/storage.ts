import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCESS = 'bbb.accessToken';
const REFRESH = 'bbb.refreshToken';

export async function getAccessToken() {
  return AsyncStorage.getItem(ACCESS);
}

export async function getRefreshToken() {
  return AsyncStorage.getItem(REFRESH);
}

export async function setTokens(accessToken: string, refreshToken: string) {
  await AsyncStorage.multiSet([
    [ACCESS, accessToken],
    [REFRESH, refreshToken],
  ]);
}

export async function clearTokens() {
  await AsyncStorage.multiRemove([ACCESS, REFRESH]);
}
