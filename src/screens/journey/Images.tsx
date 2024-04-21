import React, { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/core';

import { useTheme, useTranslation } from '../../hooks';
import { Block, Button, Image, Text } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { makeNewAttachment, updateMyBusiness } from '../../api/business';

const isAndroid = Platform.OS === 'android';

const ImagesScreen = () => {
  const { t } = useTranslation();
  const { assets, colors, sizes } = useTheme();
  const { business } = useAuth();
  const navigator = useNavigation();
  const [logo, setLogo] = useState(null);
  const [logoId, setLogoId] = useState(null);
  const [cover, setCover] = useState(null);
  const [coverId, setCoverId] = useState(null);

  const pickLogoImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    const asset = result.assets[0];
    if (!result.canceled) {
      setLogo(asset.uri);
    }
    const banner = await handleUpload(asset);
    setLogoId(banner.id);
  };

  const pickCoverImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
    });

    const asset = result.assets[0];
    if (!result.canceled) {
      setCover(asset.uri);
    }
    const banner = await handleUpload(asset);
    setCoverId(banner.id);
  };

  const handleUpload = useCallback(async (asset: ImagePicker.ImagePickerAsset) => {
    const datas = new FormData();

    datas.append('attachment', {
      name: asset.fileName,
      type: asset.type,
      uri:
        Platform.OS === 'android' ? asset.uri : asset.uri.replace('file://', ''),
    });
    const response = await makeNewAttachment(datas);
    return response;
  }, []);

  const handleNext = useCallback(async () => {
    await updateMyBusiness(business.id, {
      logo_id: logoId,
      banner_id: coverId,
    });
    navigator.navigate('JourneyOffers');
  }, [navigator, business, logoId, coverId]);

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
              {t('journey.logos')}
            </Text>
          </Image>
        </Block>

        <Block
          behavior={!isAndroid ? 'padding' : 'height'}
          marginTop={-(sizes.height * 0.15 - sizes.l)}>
          <Block
            flex={0}
            radius={sizes.sm}
            marginHorizontal="8%"
          >
            <Block
              flex={0}
              intensity={90}
              radius={sizes.sm}
              overflow="hidden"
              justify="center"
              align='center'
              tint={colors.blurTint}
              style={{ position: 'relative' }}
              paddingBottom={50}
            >
              <Block paddingHorizontal={sizes.sm}>
              </Block>
              {cover &&
                <Image
                  source={{ uri: cover }}
                  resizeMode="center"
                  width={sizes.width * 0.8}
                  height={sizes.height * 0.3}
                />
              }
              {logo &&
                <Image
                  borderRadius={100}
                  source={{ uri: logo }}
                  resizeMode="center"
                  height={100}
                  width={100}
                  style={{ position: 'absolute', bottom: 0 }}
                />
              }
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
            shadow={!isAndroid}
          >
            <Block
              row
              flex={0}
              radius={sizes.sm}
              overflow="hidden"
              justify="space-evenly"
              tint={colors.blurTint}
              paddingVertical={sizes.sm}>
              <Button
                flex={1}
                secondary
                outlined
                shadow={!isAndroid}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                onPress={pickCoverImage}
              >
                <Text bold secondary align='center' transform="uppercase">
                  {t('journey.uploadBanner')}
                </Text>
              </Button>
              <Button
                flex={1}
                secondary
                outlined
                shadow={!isAndroid}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                onPress={pickLogoImage}
              >
                <Text bold secondary align='center' transform="uppercase">
                  {t('journey.uploadLogo')}
                </Text>
              </Button>
            </Block>
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
                onPress={handleNext}
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

export default ImagesScreen;
