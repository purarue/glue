import React, { memo } from "react";

import { setWindowMsg } from "./../home";
import {
  jitterCenterLocation,
  getWindowDimensions,
} from "./../components/dimensions";
import Dialog from "../components/dialog";
import { launchWindowFunc } from "./actions";
import TapLink from "./../components/taplink";

const minHeight = 200;
const minWidth = 200;

const dataScale = 0.4;

export function DataWindow(setwMsg: setWindowMsg): launchWindowFunc {
  return () => {
    const { browserHeight, browserWidth } = getWindowDimensions();
    const { x, y } = jitterCenterLocation();
    const dialogWidth = Math.max(minWidth, browserWidth * dataScale);
    const dialogHeight = Math.max(minHeight, browserHeight * dataScale);
    const windowId = Date.now().toString();
    const dialogObj = (
      <>
        <Dialog
          x={x - dialogWidth / 2}
          y={y - dialogHeight / 2}
          width={dialogWidth}
          height={dialogHeight}
          title="Data"
          windowId={windowId}
          minHeight={minHeight}
          minWidth={minWidth}
          // when close is hit, set the message to kill this window
          hitCloseCallback={() => setwMsg({ spawn: false, windowId: windowId })}
        >
          <DataBody />
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

const DataBody = memo(() => {
  return (
    <div className="data-body">
      <p>
        For a while, I{"'"}ve been involved with writing{" "}
        <TapLink
          href="https://purarue.xyz/projects/"
          target="_blank"
          rel="noreferrer"
        >
          data exporters
        </TapLink>{" "}
        (saving and parsing data from applications and websites I use)
      </p>
      <p>
        My{" "}
        <TapLink
          href="https://github.com/purarue/HPI"
          target="_blank"
          rel="noreferrer"
        >
          HPI
        </TapLink>{" "}
        (Human Programming Interface) repository acts as a sort of entrypoint to
        all of my data, allowing me to do quick queries against data from old
        websites, tools, browser histories, etc.
      </p>
      <p>
        {`The 'Media Feed' here also heavily leans on HPI to get data from the many online media websites I use`}
      </p>
      <p>
        See{" "}
        <TapLink
          href="https://purarue.xyz/x/blog/ramblings-journal-art-technology/"
          target="_blank"
        >
          blog post
        </TapLink>{" "}
        for a reflection on a bit of how I think about using the tools/data.
      </p>
    </div>
  );
});
