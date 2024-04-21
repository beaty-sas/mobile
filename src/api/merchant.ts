import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from '../utils/axios';

import { IMerchant } from '../types/merchant';

// ----------------------------------------------------------------------

export function useGetMe(): {
  merchant: IMerchant;
  merchantLoading: boolean;
  merchantError: any;
  merchantValidating: boolean;
  merchantEmpty: boolean;
} {
  const URL = endpoints.merchant.info;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      merchant: data as IMerchant,
      merchantLoading: isLoading,
      merchantError: error,
      merchantValidating: isValidating,
      merchantEmpty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function getMerchant() {
  const URL = endpoints.merchant.info;

  const response = await axiosInstance.get(URL);
  
  return response.data ;
}

// ----------------------------------------------------------------------