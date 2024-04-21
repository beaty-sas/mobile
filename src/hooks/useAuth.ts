import * as AuthSession from "expo-auth-session";
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from "react";
import { getMerchant } from "../api/merchant";
import axiosInstance from "../utils/axios";
import { IMerchant } from "../types/merchant";
import { IBusiness } from "../types/business";

WebBrowser.maybeCompleteAuthSession();
const redirectUri = AuthSession.makeRedirectUri();

export const useAuth = () => {
  const discovery = AuthSession.useAutoDiscovery('https://reserve-exp.eu.auth0.com');
  const [user, setUser] = useState<IMerchant>();
  const [business, setBusiness] = useState<IBusiness>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getToken = async (code: string) => {
    const codeRes = await AuthSession.exchangeCodeAsync(
      {
        code,
        redirectUri,
        clientId: 'WzCQ8wykXq0q9IHUEpgzNLH3xPxQNdA9',
        extraParams: {
          code_verifier: request?.codeVerifier
        }

      },
      { tokenEndpoint: 'https://reserve-exp.eu.auth0.com/oauth/token' }
    )
    const tokenConfig = codeRes?.getRequestConfig();
    return tokenConfig.accessToken;
  }

  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: 'WzCQ8wykXq0q9IHUEpgzNLH3xPxQNdA9',
      redirectUri,
      scopes: ['openid', 'profile', 'email', 'offline_access'],
      extraParams: {
        audience: 'https://reserve-exp.eu.auth0.com/api/v2/',

      },
    },
    discovery
  );


  const authUser = async () => {
    promptAsync();
  }

  const getMe = async () => {
    const merchant: IMerchant  = await getMerchant()
    setUser(merchant)
    setBusiness(merchant?.businesses?.[0])
    setIsAuthenticated(true)
    return merchant;
  }

  useEffect(() => {
    if (result && result?.params) {
      getToken(result?.params?.code).then((token: string) => {
        SecureStore.setItemAsync('AUTH_TOKEN', token)
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        getMe();
      })
    }
  }, [result])

  useEffect(() => {
    SecureStore.getItemAsync('AUTH_TOKEN').then(token => {
      if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        getMe();
      }
    })
  }, [])

  return { authUser, user, business, getMe, isAuthenticated };
};