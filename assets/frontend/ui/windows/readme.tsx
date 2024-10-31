import React, { memo } from "react";

import { setWindowMsg } from "./../home";
import Dialog from "../components/dialog";
import { dialogInfo, launchWindowFunc } from "./actions";
import TapLink from "./../components/taplink";

const minHeight = 450;
const minWidth = 250;

const readmeScale = 0.55;

const discordUserName = "purplepinapples";

function alertDiscordName() {
  window.alert(discordUserName);
}

function alertEmail() {
  window.alert(
    "I don't leave this publicly visible anymore, but you can leave yours in the guestbook (comments are private till I approve them) and I'll get back to you",
  );
}

export function ReadmeWindow(setwMsg: setWindowMsg): launchWindowFunc {
  return () => {
    const { x, y, dialogWidth, dialogHeight, windowId, closeWindow } =
      dialogInfo(
        readmeScale,
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
          width={dialogWidth}
          height={dialogHeight}
          title="readme"
          windowId={windowId}
          minHeight={minHeight}
          minWidth={minWidth}
          // when close is hit, set the message to kill this window
          hitCloseCallback={closeWindow}
        >
          <ReadmeBody />
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

const ReadmeBody = memo(() => {
  return (
    <div className="readme-body">
      <h3 className="hi">Hi!</h3>
      <p>
        The windows here can be resized and dragged around. The top left button
        can be used to close windows; the arrows in the top right can be used to
        scroll
      </p>
      <hr />
      <h4>Contact</h4>
      <p>
        I don't use social media all that much, but feel free to:
        <ul>
          <li>
            <TapLink
              href="https://github.com/purarue/ama"
              target="_blank"
              rel="noreferrer"
            >
              AMA
            </TapLink>
          </li>
          <li>
            <a
              style={{ cursor: "pointer" }}
              onClick={alertDiscordName}
              onTouchEnd={alertDiscordName}
            >
              {`Add me on Discord (${discordUserName})`}
            </a>
          </li>
          <li>
            <a href="#" onClick={alertEmail} onTouchEnd={alertEmail}>
              Email
            </a>
          </li>
        </ul>
      </p>
      <p>
        If you're interested in my random thoughts, my{" "}
        <TapLink
          href="https://purarue.xyz/x/notes/"
          target="_blank"
          rel="noreferrer"
        >
          notes website
        </TapLink>{" "}
        has lots of those. You can also just sign the Guest Book here :)
      </p>
      <h5>Thanks for visiting!</h5>
    </div>
  );
});
