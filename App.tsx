import { DataProvider, TranslationProvider } from './src/hooks';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigation/App';
import { SWRConfig } from 'swr';
import { AppState } from 'react-native';


export default function App() {


  return (
    <SafeAreaProvider>
      <DataProvider>
        <TranslationProvider>
          <SWRConfig value={{
            isVisible: () => { return true },
            provider: () => new Map(),
            initFocus(callback) {
              let appState = AppState.currentState
         
              const onAppStateChange = (nextAppState) => {
                /* If it's resuming from background or inactive mode to active one */
                if (appState.match(/inactive|background/) && nextAppState === 'active') {
                  callback()
                }
                appState = nextAppState
              }
         
              // Subscribe to the app state change events
              const subscription = AppState.addEventListener('change', onAppStateChange)
         
              return () => {
                subscription.remove()
              }
            }
          }}>
            <Navigation />
          </SWRConfig>
        </TranslationProvider>
      </DataProvider>
    </SafeAreaProvider>
  );
}
