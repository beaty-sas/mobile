import { IBusiness } from "./business";

export type IMerchant = {
  sub: string;
  first_time_journey_finished: boolean;
  businesses: IBusiness[];
}
