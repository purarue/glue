import React from "react";

import { setWindowMsg } from "./../home";
import Dialog from "../components/dialog";
import { dialogInfo, launchWindowFunc } from "./actions";
import { AppWindow } from "./folder";

const minHeight = 180;
const minWidth = 300;

const scale = 0.3;

export function WritingWindow(setwMsg: setWindowMsg): launchWindowFunc {
  return () => {
    const { x, y, dialogWidth, dialogHeight, windowId, closeWindow } =
      dialogInfo(
        scale,
        {
          height: minHeight,
          width: minWidth,
        },
        setwMsg,
      );
    const dialogObj = (
      <>
        <Dialog
          noCenter={true}
          x={x - dialogWidth / 2}
          y={y - dialogHeight / 2}
          width={dialogWidth}
          height={dialogHeight}
          title="Writing"
          windowId={windowId}
          minHeight={minHeight}
          minWidth={minWidth}
          hitCloseCallback={closeWindow}
        >
          <WritingBody setwMsg={setwMsg} />
        </Dialog>
      </>
    );
    // when the icon is clicked, set the message to spawn this window
    setwMsg({
      spawn: true,
      windowId: windowId,
      windowObj: dialogObj,
    });
  };
}

const WritingBody = ({ setwMsg }: { setwMsg: setWindowMsg }) => {
  return (
    <AppWindow
      setwMsg={setwMsg}
      icons={[
        {
          name: "Blog",
          url: "https://purarue.xyz/x/blog/",
          icon: "/images/frontend/feather.png",
        },
        {
          name: "Notes",
          url: "https://purarue.xyz/x/",
          icon: "/images/frontend/brain.png",
        },
      ]}
    />
  );
};
