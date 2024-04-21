import React, { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { useTheme, useTranslation } from '../../hooks';
import { Block, Button, Image, Input, Text } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import * as regex from '../../constants/regex';
import { updateMyBusiness } from '../../api/business';
import { useNavigation } from '@react-navigation/core';

const isAndroid = Platform.OS === 'android';

interface IJourneyData {
  name: string;
  phoneNumber: string;
}
interface IJourneyDataValid {
  name: boolean;
  phoneNumber: boolean;
}

const NameAndPhoneScreen = () => {
  const { business } = useAuth();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { assets, colors, sizes } = useTheme();

  const [journeyData, setJourneyData] = useState<IJourneyData>({
    name: business?.display_name || '',
    phoneNumber: business?.phone_number || '',
  });
  const [isValid, setIsValid] = useState<IJourneyDataValid>({
    name: false,
    phoneNumber: false,
  });

  const handleChange = useCallback(
    (value: Partial<IJourneyData>) => {
      setJourneyData((state) => ({ ...state, ...value }));
    },
    [setJourneyData],
  );

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      name: regex.name.test(journeyData.name),
      phoneNumber: regex.phoneNumber.test(journeyData.phoneNumber),
    }));
  }, [journeyData, setIsValid]);


  const handleSave = useCallback(async () => {
    await updateMyBusiness(business?.id, {
      display_name: !journeyData.name ? business?.display_name : journeyData.name,
      phone_number: !journeyData.phoneNumber ? business?.phone_number : journeyData.phoneNumber,
    });
    navigation.navigate('JourneyImages');
  }, [journeyData, business]);

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
              {t('journey.namePhoneTitle')}
            </Text>
          </Image>
        </Block>
        <Block
          keyboard
          behavior={!isAndroid ? 'padding' : 'height'}
          marginTop={-(sizes.height * 0.07 - sizes.l)}>
          <Block
            flex={0}
            radius={sizes.sm}
            marginHorizontal="8%"
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
          >
            <Block
              blur
              flex={0}
              intensity={90}
              radius={sizes.sm}
              overflow="hidden"
              justify="space-evenly"
              tint={colors.blurTint}
              paddingVertical={sizes.sm}>
              <Block paddingHorizontal={sizes.sm}>
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.businessName')}
                  placeholder={business?.display_name ?? t('common.businessNamePlaceholder')}
                  success={Boolean(journeyData.name && isValid.name)}
                  danger={Boolean(journeyData.name && !isValid.name)}
                  onChangeText={(value) => handleChange({ name: value })}
                />
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.businessPhone')}
                  keyboardType="number-pad"
                  placeholder={business?.phone_number ?? t('common.businessPhonePlaceholder')}
                  success={Boolean(journeyData.phoneNumber && isValid.phoneNumber)}
                  danger={Boolean(journeyData.phoneNumber && !isValid.phoneNumber)}
                  onChangeText={(value) => handleChange({ phoneNumber: value })}
                />
              </Block>
            </Block>
          </Block>
        </Block>
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
                onPress={handleSave}
              >
                <Text bold primary transform="uppercase">
                  {t('buttons.continue')}
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default NameAndPhoneScreen;
