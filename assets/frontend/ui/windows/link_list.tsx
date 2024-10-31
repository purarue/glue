import React from "react";

import { setWindowMsg } from "./../home";
import Dialog from "../components/dialog";
import TapLink from "../components/taplink";
import { LinkInfo } from "../../data";
import { dialogInfo, launchWindowFunc } from "./actions";

const linkLineHeight = 30;
const defaultMinWidth = 320;

interface ILinkWindow {
  setwMsg: setWindowMsg;
  links: LinkInfo[];
  title: string;
  minWidth?: number;
  minHeight?: number;
}

export function LinkWindow(props: ILinkWindow): launchWindowFunc {
  const minWidth = props.minWidth ?? defaultMinWidth;
  // 40 is a buffer for the menu bar
  const minHeight = props.minHeight ?? 40 + props.links.length * linkLineHeight;
  return () => {
    const { x, y, dialogWidth, dialogHeight, windowId, closeWindow } =
      dialogInfo(
        0.2,
        {
          height: minHeight,
          width: minHeight,
        },
        props.setwMsg,
      );
    const linkDialog = (
      <>
        <Dialog
          /* average af the center - minWidth and center - windowWidth
           * seems to work well for this window size on both mobile/desktop */
          x={(x - minWidth + (x - dialogWidth / 2)) / 2}
          y={Math.max(y - minHeight, y - dialogHeight / 2)}
          width={dialogWidth}
          height={dialogHeight}
          minHeight={minHeight}
          minWidth={minWidth}
          title={props.title}
          windowId={windowId}
          // when close is hit, set the message to kill this window
          hitCloseCallback={closeWindow}
        >
          <div className="linklist">
            {props.links.map((el: LinkInfo) => (
              <div key={el.name} title={el.tooltip}>
                <span>
                  <TapLink
                    className="linklist-item"
                    href={el.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {el.name}
                  </TapLink>
                </span>
              </div>
            ))}
          </div>
        </Dialog>
      </>
    );
    // when the icon is clicked, set the message to spawn this window
    props.setwMsg({
      spawn: true,
      windowId: windowId,
      windowObj: linkDialog,
    });
  };
}
