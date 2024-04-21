import React from 'react';
import { Platform } from 'react-native';

import { useTheme, useTranslation } from '../hooks';
import { Block, Button, Image, Text } from '../components';
import { useAuth } from '../hooks/useAuth';

const isAndroid = Platform.OS === 'android';


const AuthScreen = () => {
  const { t } = useTranslation();
  const { assets, colors, sizes } = useTheme();
  const { authUser } = useAuth();

  return (
    <Block safe marginTop={sizes.md}>
      <Block paddingHorizontal={sizes.s}>
        <Block flex={0} style={{ zIndex: 0 }}>
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            radius={sizes.cardRadius}
            source={assets.background}
            height={sizes.height * 0.3}>
            <Button
              row
              flex={0}
              justify="flex-start">
            </Button>

            <Text h4 center white marginBottom={sizes.md}>
              {t('register.title')}
            </Text>
          </Image>
        </Block>
        {/* register form */}
        <Block
          width={sizes.width}
          bottom={0}
          position='absolute'
          behavior={!isAndroid ? 'padding' : 'height'}
        >
          <Block
            flex={0}
            radius={sizes.sm}
            marginHorizontal="8%"
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
          >
            <Block
              blur
              flex={0}
              radius={sizes.sm}
              overflow="hidden"
              justify="space-evenly"
              tint={colors.blurTint}
              paddingVertical={sizes.sm}>
              <Button
                primary
                outlined
                shadow={!isAndroid}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                onPress={authUser}
              >
                <Text bold primary transform="uppercase">
                  {t('register.authorize')}
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default AuthScreen;
