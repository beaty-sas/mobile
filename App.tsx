import { DataProvider, TranslationProvider } from './src/hooks';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './src/navigation/App';


export default function App() {


  return (
    <SafeAreaProvider>
      <DataProvider>
        <TranslationProvider>
          <Navigation />
        </TranslationProvider>
      </DataProvider>
    </SafeAreaProvider>
  );
}
