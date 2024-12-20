import React, {
  createContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useRef,
} from "react";

import {
  requestAndSetCubing,
  requestAndSetComments,
  requestAndSetPageHits,
  sendPageHit,
  RCubingData,
  RPageHits,
  RGuestBookComments,
} from "./api_model";

// defines the connection with the API, exposes that context/state
// using hooks to the rest of the application

// https://stackoverflow.com/a/57908436/9348376

interface IProps {
  children?: any;
}

type Context = {
  cubing?: RCubingData;
  comments?: RGuestBookComments;
  pageHits?: RPageHits;
  // hard to model this without making it 'global',
  // as windows get launched from closures with different function aritys
  selectedWindow?: string;
  backgroundColor: string;
  // setContext: Dispatch<SetStateAction<Context>>;
  setContext: setContextFunc;
};

type setContextFunc = Dispatch<SetStateAction<Context>>;
const defaultBackgroundColor = "#222";

const initialContext: Context = {
  backgroundColor: defaultBackgroundColor,
  setContext: (): void => {
    throw new Error("setContext function must be overridden");
  },
};

const setSelectedWindow = (setCtx: setContextFunc, windowId?: string) => {
  setCtx((oldData: Context): Context => {
    return {
      ...oldData,
      selectedWindow: windowId,
    };
  });
};

const setBackgroundColor = (
  setCtx: setContextFunc,
  backgroundColor: string,
) => {
  setCtx((oldData: Context): Context => {
    return {
      ...oldData,
      backgroundColor: backgroundColor,
    };
  });
};

const AppContext = createContext<Context>(initialContext);

const AppContextProvider = ({ children }: IProps): JSX.Element => {
  const loading = useRef(false);
  const [contextState, setContext] = useState<Context>(initialContext);

  // request all data from the API in the background
  // providers wait till they load using the Consumer
  // whenever requests are done
  const loadData = async () => {
    await Promise.all([
      requestAndSetCubing(setContext),
      requestAndSetComments(setContext),
      requestAndSetPageHits(setContext),
      sendPageHit(),
    ]).then(() => {
      loading.current = false;
    });
  };

  useEffect(() => {
    if (loading.current === true) {
      return;
    } else {
      loading.current = false;
      loadData();
    }
  }, [loading]);

  return (
    <AppContext.Provider value={{ ...contextState, setContext }}>
      {children}
    </AppContext.Provider>
  );
};

const AppContextConsumer = AppContext.Consumer;

export {
  Context,
  AppContext,
  AppContextProvider,
  AppContextConsumer,
  setContextFunc,
  setSelectedWindow,
  setBackgroundColor,
};
