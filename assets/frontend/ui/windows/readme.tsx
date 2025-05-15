import React, { lazy, memo, Suspense } from "react";

import { setWindowMsg } from "./../home";
import { dialogInfo, launchWindowFunc } from "./actions";
import TapLink from "./../components/taplink";

const height = 400;
const width = 275;

const discordUserName = "purplepinapples";

function alertDiscordName() {
  window.alert(discordUserName);
}

function alertEmail() {
  window.alert(
    "I don't leave my email publicly visible anymore, but you can leave yours in the guestbook (comments are private till I approve them) and I'll get back to you!",
  );
}

const Dialog = lazy(() => import("../components/dialog"));
export function ReadmeWindow(setwMsg: setWindowMsg): launchWindowFunc {
  return () => {
    const { x, y, dialogWidth, dialogHeight, windowId, closeWindow } =
      dialogInfo({
        size: {
          height: height,
          width: height,
        },
        setwMsg,
        increaseSizeIfAvailable: true,
      });
    setwMsg({
      spawn: true,
      windowId: windowId,
      windowObj: (
        <Suspense fallback={null}>
          <Dialog
            x={x - dialogWidth / 2}
            y={y - dialogHeight / 2}
            width={dialogWidth}
            height={dialogHeight}
            UI={{
              title: "readme",
            }}
            windowId={windowId}
            minHeight={height - 100}
            minWidth={width - 100}
            hitCloseCallback={closeWindow}
          >
            <ReadmeBody />
          </Dialog>
        </Suspense>
      ),
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
      <p>I don't use social media all that much, but you can:</p>
      <ul>
        <li>
          {"Add me on "}
          <a
            style={{ cursor: "pointer" }}
            onClick={alertDiscordName}
            onTouchEnd={alertDiscordName}
          >
            {`Discord (${discordUserName})`}
          </a>
        </li>
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
          <a href="#" onClick={alertEmail} onTouchEnd={alertEmail}>
            Email
          </a>
          {" me"}
        </li>
      </ul>
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
