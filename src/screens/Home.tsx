import React from 'react';

import { useTheme, useTranslation } from '../hooks/';
import { Block, Text } from '../components/';
import { Platform, TouchableOpacity } from 'react-native';
import { useGetBookingAnalytics, useGetBookings } from '../api/booking';
import { useAuth } from '../hooks/useAuth';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';

const isAndroid = Platform.OS === 'android';


const HomeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { business } = useAuth();
  const { colors, sizes } = useTheme();
  const { bookingAnalytic } = useGetBookingAnalytics()
  const { bookings } = useGetBookings(business?.id);

  const parseTime = (dateTime: Date) => {
    return dateTime.toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short',
    });
  }

  return (
    <Block scroll>
      <Block>
        <Block
          radius={sizes.sm}
          margin={sizes.s}
          padding={sizes.sm}
          color={colors.white}
        >
          <Block row justify="space-around" align='center'>
            <Text bold>{t('dashboard.totalBookingCount')}</Text>
            <Block flex={1} row align='flex-end' justify='flex-end'>
              <Text>{bookingAnalytic?.total}</Text>
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
            <Text bold>{t('dashboard.futureBookingCount')}</Text>
            <Block flex={1} row align='flex-end' justify='flex-end'>
              <Text>{bookingAnalytic?.future}</Text>
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
            <Text bold>{t('dashboard.todayBookingCount')}</Text>
            <Block flex={1} row align='flex-end' justify='flex-end'>
              <Text>{bookingAnalytic?.today}</Text>
            </Block>
          </Block>
        </Block>
      </Block>
      <Block flex={2}>
        <FlatList
          nestedScrollEnabled={true}
          data={bookings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('BookingInfo', { bookingId: item.id })}>
              <Block
                flex={1}
                radius={sizes.sm}
                margin={sizes.s}
                padding={sizes.sm}
                color={colors.white}
                shadow={!isAndroid}
              >
                <Block row justify="space-around" align='center'>
                  <Block>
                    <Text bold>{item?.user?.display_name}  </Text>
                    <Text>{item?.user?.phone_number}</Text>
                  </Block>
                  <Block align='flex-end' justify='flex-end'>
                    <Text>{parseTime(new Date(item?.start_time))}  </Text>
                    <Text>{item?.price} грн</Text>
                  </Block>
                </Block>
              </Block>
            </TouchableOpacity>
          )}
        />
      </Block>
    </Block>
  );
};

export default HomeScreen;
