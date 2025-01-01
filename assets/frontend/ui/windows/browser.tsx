import React, { useState, useRef } from "react";

import { setWindowMsg } from "./../home";
import Dialog from "../components/dialog";
import { dialogInfo, fullScreenDialogScale, launchWindowFunc } from "./actions";

const minHeight = 400;
const minWidth = 300;

export function BrowserWindow(setwMsg: setWindowMsg): launchWindowFunc {
  return () => {
    const { x, y, dialogWidth, dialogHeight, windowId, closeWindow } =
      dialogInfo(
        fullScreenDialogScale,
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
          x={x - dialogWidth / 2}
          y={y - dialogHeight / 2}
          width={dialogWidth}
          height={dialogHeight}
          title="browser"
          windowId={windowId}
          minHeight={minHeight}
          disableBodyDragging={true}
          minWidth={minWidth}
          hitCloseCallback={closeWindow}
        >
          <Browser />
        </Dialog>
      ),
    });
  };
}

const defaultURL = "https://en.wikipedia.org/wiki/Special:Random";

const Browser = () => {
  const [formUrl, setFormUrl] = useState<string>(defaultURL);
  const [iframeURL, setIFrameURL] = useState<string>(defaultURL);
  const textField = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    // prepend http if needed
    let httpUrl: string = (" " + formUrl).slice(1); // deep copy
    if (!httpUrl.startsWith("http")) {
      httpUrl = "http://" + httpUrl;
    }
    setIFrameURL(""); // set to nothing
    // then reset in .1 seconds
    setTimeout(() => {
      setIFrameURL(httpUrl);
    }, 100);
  };

  return (
    <div className="browser-body">
      <div className="browser-controls">
        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            ref={textField}
            onTouchEnd={() => {
              textField.current!.focus();
            }} // for mobile
            type="text"
            name="url"
            className="controls-input"
            value={formUrl}
            onChange={(e: any) => {
              setFormUrl(e.target.value);
            }}
          />
          <a
            href="#"
            className="input-go pixel unlinkify"
            onTouchEnd={handleSubmit}
            onClick={handleSubmit}
          >
            Go
          </a>
          {/* so that ctrl enter works */}
          <input type="submit" style={{ display: "none" }} />
        </form>
      </div>
      <div className="iframe-wrapper">
        <iframe src={iframeURL}> </iframe>
      </div>
    </div>
  );
};
