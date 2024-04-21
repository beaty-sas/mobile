import React, { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { useTheme, useTranslation } from '../../hooks';
import { Block, Button, Checkbox, Image, Input, Text } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import * as regex from '../../constants/regex';
import { useNavigation } from '@react-navigation/core';
import { IOfferSimple } from '../../types/offer';
import { createNewOffer } from '../../api/offer';

const isAndroid = Platform.OS === 'android';

interface IJourneyData {
  name: string;
  price: number;
  duration: number;
  allow_photo: boolean;
}
interface IJourneyDataValid {
  name: boolean;
  price: boolean;
  duration: boolean;
}

const OffersScreen = () => {
  const { business } = useAuth();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { assets, colors, sizes } = useTheme();
  const [offers, setOffers] = useState<IOfferSimple[]>([])

  const [journeyData, setJourneyData] = useState<IJourneyData>({
    name: '',
    price: null,
    duration: null,
    allow_photo: false,
  });
  const [isValid, setIsValid] = useState<IJourneyDataValid>({
    name: false,
    price: false,
    duration: false,
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
      price: regex.number.test(String(journeyData.price)),
      duration: regex.number.test(String(journeyData.duration)),
    }));
  }, [journeyData, setIsValid]);


  const handleSave = useCallback(async () => {
    if (!isValid.name || !isValid.price || !isValid.duration) {
      return;
    }
    const offer: IOfferSimple = {
      name: journeyData.name,
      price: journeyData.price,
      duration: journeyData.duration,
      allow_photo: true,
      business_id: business.id,
    }
    setOffers((state) => [...state, offer])
    setJourneyData({
      name: '',
      price: journeyData.price,
      duration: journeyData.duration,
      allow_photo: false,
    });
  }, [journeyData]);


  const handleContinue = useCallback(async () => {
    offers.forEach(async (offer) => {
      await createNewOffer(offer, business.slug)
    })

    navigation.navigate('WorkingHours');
  }, [navigation, offers])

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
              {t('journey.offer.title')}
            </Text>
          </Image>
        </Block>

        <Block
          keyboard
          behavior={!isAndroid ? 'padding' : 'height'}
          marginTop={-(sizes.height * 0.2 - sizes.l)}
          marginBottom={sizes.height * 0.1}
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
              intensity={90}
              radius={sizes.sm}
              overflow="hidden"
              justify="space-evenly"
              tint={colors.blurTint}
              paddingVertical={sizes.sm}>
              <Block paddingHorizontal={sizes.sm}>
                {offers.length
                  ? <Block shadow={!isAndroid}>
                    {offers.map((item, index) => (
                      <Block
                        key={`offer-${index}`}
                        flex={1}
                        radius={sizes.sm}
                        margin={sizes.s}
                        padding={sizes.sm}
                        color={colors.white}
                        shadow={!isAndroid}>
                        <Block row justify="space-around">
                          <Text bold>{item?.name}</Text>
                          <Block flex={1} row align='flex-end' justify='flex-end'>
                            <Text>{item?.duration}хв  </Text>
                            <Text>{item?.price}грн</Text>
                          </Block>
                        </Block>
                      </Block>
                    ))}
                  </Block>
                  : null
                }
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('journey.offer.name')}
                  placeholder={t('journey.offer.namePlaceholder')}
                  success={Boolean(journeyData.name && isValid.name)}
                  danger={Boolean(journeyData.name && !isValid.name)}
                  onChangeText={(value) => handleChange({ name: value })}
                />
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('journey.offer.price')}
                  keyboardType="number-pad"
                  placeholder={t('journey.offer.pricePlaceholder')}
                  success={Boolean(journeyData.price && isValid.price)}
                  danger={Boolean(journeyData.price && !isValid.price)}
                  onChangeText={(value) => handleChange({ price: Number(value) })}
                />
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('journey.offer.duration')}
                  keyboardType="number-pad"
                  placeholder={t('journey.offer.durationPlaceholder')}
                  success={Boolean(journeyData.duration && isValid.duration)}
                  danger={Boolean(journeyData.duration && !isValid.duration)}
                  onChangeText={(value) => handleChange({ duration: Number(value) })}
                />
                <Block row flex={0} align="center" marginBottom={sizes.m}>
                  <Checkbox
                    marginRight={sizes.sm}
                    checked={journeyData.allow_photo}
                    onPress={(value) => handleChange({ allow_photo: value })}
                  />
                  <Text paddingRight={sizes.s}>
                    {t('journey.offer.allowPhoto')}
                  </Text>
                </Block>
                <Button
                  primary
                  outlined
                  shadow={!isAndroid}
                  marginVertical={sizes.s}
                  onPress={handleSave}
                >
                  <Text bold primary transform="uppercase">
                    {t('buttons.save')}
                  </Text>
                </Button>
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
                onPress={handleContinue}
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

export default OffersScreen;
