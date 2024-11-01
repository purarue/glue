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
      dialogInfo({
        scale: scale,
        minSize: {
          height: minHeight,
          width: minHeight,
        },
        setwMsg,
      });
    setwMsg({
      spawn: true,
      windowId: windowId,
      windowObj: (
        <Dialog
          x={x - dialogWidth / 2}
          y={y - dialogHeight / 2}
          width={minWidth}
          height={minHeight}
          UI={{
            title: "title",
          }}
          windowId={windowId}
          minHeight={minHeight}
          minWidth={minWidth}
          hitCloseCallback={closeWindow}
        >
          <Body />
        </Dialog>
      ),
    });
  };
}

const Body = () => {
  return <>Body</>;
};
