import React from 'react';

import { useTheme, useTranslation } from '../hooks/';
import { Block, Button, Image, Text } from '../components/';
import { useGetBookingInfo } from '../api/booking';
import { Platform } from 'react-native';

const isAndroid = Platform.OS === 'android';

const BookingInfoScreen = ({ route }) => {
  const { t } = useTranslation();
  const { bookingId } = route.params;
  const { colors, sizes } = useTheme();
  const { booking } = useGetBookingInfo(bookingId)

  console.log(booking)

  const parseTime = (dateTime: Date) => {
    return dateTime.toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short',
    });
  }

  return (
    <Block safe>
      <Block style={{ minHeight: 500 }} keyboard>
        <Block>
          <Block
            radius={sizes.sm}
            margin={sizes.s}
            padding={sizes.sm}
            color={colors.white}
          >
            <Block row justify="space-around" align='center'>
              <Text bold>{booking?.user?.display_name}</Text>
              <Block flex={1} row align='flex-end' justify='flex-end'>
                <Text>{booking?.user?.phone_number}</Text>
              </Block>
            </Block>
          </Block>
          <Block
            radius={sizes.sm}
            margin={sizes.s}
            padding={sizes.sm}
            color={colors.white}
          >
            <Block row justify="space-around" align='center'>
              <Text bold>{t('bookingInfo.startTime')}</Text>
              <Block flex={1} row align='flex-end' justify='flex-end'>
                <Text>{parseTime(new Date(booking?.start_time))}</Text>
              </Block>
            </Block>
          </Block>
          <Block
            radius={sizes.sm}
            margin={sizes.s}
            padding={sizes.sm}
            color={colors.white}
          >
            <Block row justify="space-around" align='center'>
              <Text bold>{t('bookingInfo.endTime')}</Text>
              <Block flex={1} row align='flex-end' justify='flex-end'>
                <Text>{parseTime(new Date(booking?.end_time))}</Text>
              </Block>
            </Block>
          </Block>
          <Block
            radius={sizes.sm}
            margin={sizes.s}
            padding={sizes.sm}
            color={colors.white}
          >
            <Block row justify="space-around" align='center'>
              <Text bold>{t('bookingInfo.price')}</Text>
              <Block flex={1} row align='flex-end' justify='flex-end'>
                <Text>{booking?.price} грн</Text>
              </Block>
            </Block>
          </Block>
          <Block
            radius={sizes.sm}
            margin={sizes.s}
            padding={sizes.sm}
            color={colors.white}
          >
            <Block row justify="space-around" align='center'>
              <Text bold>{t('bookingInfo.offers')}</Text>
              <Block flex={1} row align='flex-end' justify='flex-end'>
                <Text>{booking?.offers?.map((offer) => offer.name).join(', ')}</Text>
              </Block>
            </Block>
          </Block>
          {booking?.comment && <Block
            radius={sizes.sm}
            margin={sizes.s}
            padding={sizes.sm}
            color={colors.white}
          >
            <Block row justify="space-around" align='center'>
              <Text bold>{t('bookingInfo.comment')}</Text>
              <Block flex={1} row align='flex-end' justify='flex-end'>
                <Text>{booking?.comment}</Text>
              </Block>
            </Block>
          </Block>}
          {!!booking?.attachments?.length &&
            <Block
              radius={sizes.sm}
              margin={sizes.s}
              padding={sizes.sm}
              color={colors.white}
            >
              <Block row justify="space-around" align='center'>
                <Text bold>{t('bookingInfo.attachemtns')}</Text>
                <Block flex={1} align='flex-end' justify='flex-end'>
                  {booking?.attachments?.map((attachment, index) => (
                    <Block key={`attachment-${index}`} row align='center'>
                      <Image
                        source={{ uri: attachment.original }}
                        style={{ width: 100, height: 100, borderRadius: sizes.s }}
                      />
                    </Block>
                  ))}
                </Block>
              </Block>
            </Block>
          }
        </Block>
      </Block>
      <Block
        width={sizes.width}
        bottom={2}
        behavior={!isAndroid ? 'padding' : 'height'}
      >
        <Block
          radius={sizes.sm}
          marginHorizontal={sizes.s}
          shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
        >
          <Block
            blur
            radius={sizes.sm}
            overflow="hidden"
            tint={colors.blurTint}
            >
            <Button
              success
              outlined
              shadow={!isAndroid}
              marginVertical={sizes.s}
              marginHorizontal={sizes.sm}
            >
              <Text bold success transform="uppercase">
                {t('buttons.accept')}
              </Text>
            </Button>
            <Button
              danger
              outlined
              shadow={!isAndroid}
              marginVertical={sizes.s}
              marginHorizontal={sizes.sm}
            >
              <Text bold danger transform="uppercase">
                {t('buttons.cancel')}
              </Text>
            </Button>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default BookingInfoScreen;
