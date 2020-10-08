import axios, { AxiosResponse } from "axios";
import { Context, setContextFunc } from "./app_provider";

// individual feed items
interface FeedItem {
  image_url?: string;
  site_url: string;
  timestamp: string;
  title: string;
  type: string;
}

type FeedData = FeedItem[];

interface CubingData {
  completed_solves: number;
  competitions: number;
  wca_id: string;
  gender: string;
  events: CubingRecords;
}

// both single and average times for one event
interface CubingRecords {
  name: string;
  single: CubingTimes;
  average: CubingTimes;
}

// times for one type (single/average)
interface CubingTimes {
  time: string;
  national: string;
  continent: string;
  world: string;
}

// result (Value|Err) types
type RFeedData = Result<FeedData>;
type RCubingData = Result<CubingData>;

// when the interface directly matches the response, we can use a generic function
async function loadInterfaceMatches<T>(url: string): Promise<Result<T>> {
  return await axios
    .request<T>({
      url: url,
      responseType: "json",
      transformResponse: (r: T) => r,
    })
    .then((response: AxiosResponse<T>) => {
      return response.data;
    })
    .catch((e: Error) => {
      return e;
    });
}

// request and set feed data
const requestAndSetFeed = async (setData: setContextFunc) => {
  loadInterfaceMatches<FeedData>("/api/data/feed").then(
    (response: RFeedData) => {
      setData(
        (oldData: Context): Context => {
          return {
            ...oldData,
            feed: response,
          };
        }
      );
    }
  );
};

// request and set cubing data
const requestAndSetCubing = async (setData: setContextFunc) => {
  loadInterfaceMatches<CubingData>("/api/data/cubing").then(
    (response: RCubingData) => {
      setData(
        (oldData: Context): Context => {
          return {
            ...oldData,
            cubing: response,
          };
        }
      );
    }
  );
};

export {
  FeedData,
  CubingData,
  RFeedData,
  RCubingData,
  requestAndSetCubing,
  requestAndSetFeed,
};