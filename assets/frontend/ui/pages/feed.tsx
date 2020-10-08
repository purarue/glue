import React from "react";
import { Context, AppContextConsumer } from "../../app_provider";
import WrapApiError from "../components/wrap_api_error";
import { FeedData } from "./../../api_model";
import { setWindowMsg } from "./home";
import {
  getWindowDimensions,
  jitterCenterLocation,
} from "./../components/dimensions";
import Dialog from "../components/dialog";
import { fullScreenDialogScale } from "./actions";

export function FeedWindow(setwMsg: setWindowMsg): Function {
  return () => {
    const { browserWidth, browserHeight } = getWindowDimensions();
    const { x, y } = jitterCenterLocation();
    const feedDialogWidth = browserWidth * fullScreenDialogScale;
    const feedDialogHeight = browserHeight * fullScreenDialogScale;
    const windowId = Date.now().toString();
    const feedDialog = (
      <>
        <Dialog
          x={x - feedDialogWidth / 2}
          y={y - feedDialogHeight / 2}
          width={feedDialogWidth}
          height={feedDialogHeight}
          title="media feed"
          // when close it hit, set the message to kill this window
          hitCloseCallback={() => setwMsg({ spawn: false, windowId: windowId })}
        >
          <Feed />
        </Dialog>
      </>
    );
    // when the icon is clicked, set the message to spawn this window
    setwMsg({
      spawn: true,
      windowId: windowId,
      windowObj: feedDialog,
    });
  };
}

function Feed() {
  return (
    <>
      <AppContextConsumer>
        {(value: Context) => {
          return (
            <WrapApiError data={value.feed}>
              <FeedPaginator data={value.feed as FeedData} />
            </WrapApiError>
          );
        }}
      </AppContextConsumer>
    </>
  );
}

interface IFeedPaginator {
  data: FeedData;
}

const FeedPaginator = ({ data }: IFeedPaginator) => {
  return <div>{JSON.stringify(data)}</div>;
};