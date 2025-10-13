import React, { lazy, memo, Suspense } from "react";

import { Context, AppContextConsumer } from "../../app_provider";
import { CubingData, CubingRecords } from "../../api_model";
import WrapApiError from "../components/wrap_api_error";
import { setWindowMsg } from "./../home";
import TapLink from "../components/taplink";
import { dialogInfo, launchWindowFunc } from "./actions";

const height = 400;
const width = 700;

const Dialog = lazy(() => import("../components/dialog"));
export function CubingWindow(setwMsg: setWindowMsg): launchWindowFunc {
  return () => {
    const { x, y, dialogWidth, dialogHeight, windowId, closeWindow } =
      dialogInfo({
        size: {
          height: height,
          width: width,
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
              title: "cubing",
            }}
            windowId={windowId}
            minHeight={height}
            minWidth={width}
            hitCloseCallback={closeWindow}
          >
            <Cubing />
          </Dialog>
        </Suspense>
      ),
    });
  };
}

export default function Cubing() {
  return (
    <>
      <AppContextConsumer>
        {(value: Context) => {
          return (
            <WrapApiError data={value.cubing}>
              <CubingBody data={value.cubing! as CubingData} />
            </WrapApiError>
          );
        }}
      </AppContextConsumer>
    </>
  );
}

interface ICubingBody {
  data: CubingData;
}

const CubingBody = memo(({ data }: ICubingBody) => {
  return (
    <div className="cubing-body">
      <p>
        These are my records from WCA (World Cube Association) approved
        competitions. I've been to {data.competitions} competitions and have{" "}
        {data.completed_solves} completed official solves.
      </p>
      <p>
        For those unfamiliar with the notation, a Single is the time for a
        single solve, and an Average is the average of the 3 middle solves of a
        set of 5 consecutive solves. As an example, if you had 5 solves like:
        '(40.20) 30.54 28.39 (25.40) 32.50', the average would be '(30.54 +
        28.39 + 32.50) / 3'.
      </p>
      <p>
        NR specifies a my ranking nationally and WR specifies my ranking
        globally.
      </p>
      <table>
        <thead>
          <tr>
            <th rowSpan={2}>Name</th>
            <th colSpan={3}>Single</th>
            <th colSpan={3}>Average</th>
          </tr>
          <tr>
            <th>Time</th>
            <th>NR</th>
            <th>WR</th>
            <th>Time</th>
            <th>NR</th>
            <th>WR</th>
          </tr>
        </thead>
        <tbody>
          {data.events.map((cubingEvent: CubingRecords) => {
            return (
              <tr key={cubingEvent.name}>
                <td>{cubingEvent.name}</td>
                <td>{cubingEvent.single.time}</td>
                <td>{cubingEvent.single.national}</td>
                <td>{cubingEvent.single.world}</td>
                <td>{cubingEvent.average.time}</td>
                <td>{cubingEvent.average.national}</td>
                <td>{cubingEvent.average.world}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p>
        Only hardware I really care about is my 3x3, which is a{" "}
        <TapLink
          href="https://www.gancube.com/gan356-x"
          target="_blank"
          rel="noreferrer"
        >
          Gan356 X
        </TapLink>
        . For a lot of my other puzzles I just bought whatever the standard
        mid-range cubes are.
      </p>
      <p>
        For competition, I use full{" "}
        <TapLink
          href="https://www.speedsolving.com/wiki/index.php/CFOP_method"
          target="_blank"
          rel="noreferrer"
        >
          CFOP
        </TapLink>{" "}
        with some{" "}
        <TapLink
          href="https://www.speedsolving.com/wiki/index.php/COLL"
          target="_blank"
          rel="noreferrer"
        >
          COLL
        </TapLink>{" "}
        for 3x3,{" "}
        <TapLink
          href="https://www.speedsolving.com/wiki/index.php/Yau_method"
          target="_blank"
          rel="noreferrer"
        >
          Yau
        </TapLink>{" "}
        for 4x4, and{" "}
        <TapLink
          href="https://www.speedsolving.com/wiki/index.php/Ortega_Method"
          target="_blank"
          rel="noreferrer"
        >
          Ortega
        </TapLink>{" "}
        for 2x2. For other events I'm only familiar with the basics. I've played
        around with{" "}
        <TapLink
          href="https://www.speedsolving.com/wiki/index.php/Roux_method"
          target="_blank"
          rel="noreferrer"
        >
          Roux
        </TapLink>{" "}
        (~average around 40 seconds), currently use 2-look{" "}
        <TapLink
          href="https://www.speedsolving.com/wiki/index.php/CMLL"
          target="_blank"
          rel="noreferrer"
        >
          CMLL
        </TapLink>
        .
      </p>
    </div>
  );
});
