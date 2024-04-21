import React, { useCallback, useState } from 'react';
import { Platform } from 'react-native';

import { useTheme, useTranslation } from '../../hooks';
import { Block, Button, Image, Text } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/core';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { createNewWorkingHour } from '../../api/working-hours';

const isAndroid = Platform.OS === 'android';


const WorkingHoursScreen = () => {
  const { business, user } = useAuth();
  const { t, locale } = useTranslation();
  const navigation = useNavigation();
  const { assets, colors, sizes } = useTheme();
  const [timeFrom, setTimeFrom] = useState(new Date());
  const [timeTo, setTimeTo] = useState(new Date());
  const [dayFrom, setDayFrom] = useState(new Date());
  const [dayTo, setDayTo] = useState(new Date());


  const handleContinue = useCallback(async () => {
    const workingHours = [];
    const dateFrom = new Date(dayFrom);
    const dateTo = new Date(dayTo);
    const timeFromDate = new Date(timeFrom);
    const timeToDate = new Date(timeTo);
    const currentDate = new Date(dateFrom);
    dateTo.setHours(24, 59);
    while (currentDate <= dateTo) {
      const dateFrom = new Date(currentDate);
      const dateTo = new Date(currentDate);
      dateFrom.setHours(timeFromDate.getHours(), timeFromDate.getMinutes());
      dateTo.setHours(timeToDate.getHours(), timeToDate.getMinutes());
      workingHours.push({
        date_from: dateFrom.toISOString(),
        date_to: dateTo.toISOString()
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    await createNewWorkingHour(business.id, workingHours);
    await navigation.navigate('General', { screen: 'Dashboard' });
  }, [navigation, dayFrom, dayTo, timeFrom, timeTo, business, user])

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
              {t('journey.workingHours.title')}
            </Text>
          </Image>
        </Block>

        <Block
          keyboard
          behavior={!isAndroid ? 'padding' : 'height'}
          marginTop={-(sizes.height * 0.1 - sizes.l)}
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
                <Block row justify='space-between' marginBottom={sizes.m}>
                  <Text bold>{t('journey.workingHours.timeFrom')}</Text>
                  <RNDateTimePicker
                    value={timeFrom}
                    display="clock"
                    mode='time'
                    is24Hour={true}
                    locale={locale}
                    onChange={(event, date) => setTimeFrom(date)}
                  />
                </Block>
                <Block row justify='space-between' marginBottom={sizes.m}>
                  <Text bold>{t('journey.workingHours.timeTo')}</Text>
                  <RNDateTimePicker
                    value={timeTo}
                    display="clock"
                    mode='time'
                    is24Hour={true}
                    locale={locale}
                    onChange={(event, date) => setTimeTo(date)}
                  />
                </Block>
                <Block row justify='space-between' marginBottom={sizes.m}>
                  <Text bold>{t('journey.workingHours.dayFrom')}</Text>
                  <RNDateTimePicker
                    value={dayFrom}
                    display="calendar"
                    mode='date'
                    locale={locale}
                    onChange={(event, date) => setDayFrom(date)}
                  />
                </Block>
                <Block row justify='space-between'>
                  <Text bold>{t('journey.workingHours.dayTo')}</Text>
                  <RNDateTimePicker
                    value={dayTo}
                    display="calendar"
                    mode='date'
                    locale={locale}
                    onChange={(event, date) => setDayTo(date)}
                  />
                </Block>
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

export default WorkingHoursScreen;
