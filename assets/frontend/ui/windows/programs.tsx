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
      dialogInfo({
        scale: scale,
        minSize: {
          height: minHeight,
          width: minWidth,
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
          width={dialogWidth}
          height={dialogHeight}
          UI={{
            noCenter: true,
            title: "programs",
          }}
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
          name: "browser",
          icon: "/images/frontend/globe.png",
        },
        {
          name: "textedit",
          icon: "/images/frontend/texteditor.png",
        },
        {
          name: "paint",
          icon: "/images/frontend/paint.png",
        },
        {
          name: "customize",
          icon: "/images/frontend/hammer_wrench.png",
        },
      ]}
    />
  );
};
