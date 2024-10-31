import React from "react";

import { setWindowMsg } from "./../home";
import Dialog from "../components/dialog";
import { dialogInfo, launchWindowFunc } from "./actions";
import { AppWindow } from "./folder";

const minHeight = 275;
const minWidth = 325;

const scale = 0.38;

export function ProgramWindow(setwMsg: setWindowMsg): launchWindowFunc {
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
    setwMsg({
      spawn: true,
      windowId: windowId,
      windowObj: (
        <Dialog
          noCenter={true}
          x={x - dialogWidth / 2}
          y={y - dialogHeight / 2}
          width={dialogWidth}
          height={dialogHeight}
          title="programs"
          windowId={windowId}
          minHeight={minHeight}
          minWidth={minWidth}
          hitCloseCallback={closeWindow}
        >
          <AppBody setwMsg={setwMsg} />
        </Dialog>
      ),
    });
  };
}

const AppBody = ({ setwMsg }: { setwMsg: setWindowMsg }) => {
  return (
    <AppWindow
      setwMsg={setwMsg}
      icons={[
        {
          name: "Browser",
          icon: "/images/frontend/globe.png",
        },
        {
          name: "TextEdit",
          icon: "/images/frontend/texteditor.png",
        },
        {
          name: "Paint",
          icon: "/images/frontend/paint.png",
        },
        {
          name: "Customize",
          icon: "/images/frontend/hammer_wrench.png",
        },
      ]}
    />
  );
};
