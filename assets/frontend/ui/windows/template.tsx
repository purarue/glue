// this isn't used for any page, its the file I copy/paste when starting a new window
import React from "react";

import { setWindowMsg } from "./../home";
import Dialog from "../components/dialog";
import { dialogInfo, launchWindowFunc } from "./actions";

const minHeight = 150;
const minWidth = 250;

const scale = 0.5;

export function Window(setwMsg: setWindowMsg): launchWindowFunc {
  return () => {
    const { x, y, dialogWidth, dialogHeight, windowId, closeWindow } =
      dialogInfo(
        scale,
        {
          height: minHeight,
          width: minHeight,
        },
        setwMsg,
      );
    const dialogObj = (
      <>
        <Dialog
          x={x - dialogWidth / 2}
          y={y - dialogHeight / 2}
          width={minWidth}
          height={minHeight}
          title="title"
          windowId={windowId}
          minHeight={minHeight}
          minWidth={minWidth}
          // when close is hit, set the message to kill this window
          hitCloseCallback={closeWindow}
        >
          <Body />
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

const Body = () => {
  return <></>;
};
