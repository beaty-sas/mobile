import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from '../utils/axios';

import { IBusiness, IBusinessUpdate } from '../types/business';

// ----------------------------------------------------------------------

export function useGetMyBusiness(): {
  business: IBusiness;
  businessLoading: boolean;
  businessError: any;
  businessValidating: boolean;
  businessEmpty: boolean;
} {
  const URL = endpoints.business.my;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      business: (data as IBusiness),
      businessLoading: isLoading,
      businessError: error,
      businessValidating: isValidating,
      businessEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function updateMyBusiness(businessId: number, data: Partial<IBusinessUpdate>) {
  const URL = endpoints.business.list + businessId;

  await axiosInstance.patch(URL, data);

  mutate(
    URL,
    (currentData: any) => {
      if (currentData) {
        return {
          ...currentData,
          display_name: data.display_name ?? currentData.display_name,
          phone_number: data.phone_number ?? currentData.phone_number,
        };
      }
      return currentData;
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function makeNewAttachment(data: FormData) {
  const URL = endpoints.attachements;

  const response = await axiosInstance.post(URL, data, { headers: { 'Content-Type': 'multipart/form-data' } });
  return response.data;
}

// ----------------------------------------------------------------------
