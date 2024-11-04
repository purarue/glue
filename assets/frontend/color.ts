export function randomColor(): string {
  let randomHex: string = Math.floor(Math.random() * 16777215).toString(16);
  // sometimes a hex code will be 5 long, if the 6th place is '0'
  while (randomHex.length < 6) {
    randomHex += "0";
  }
  return "#" + randomHex;
}

export function isColor(strColor: string): boolean {
  if (strColor.startsWith("#")) {
    return true;
  }
  let s = new Option().style;
  s.color = strColor;
  return s.color == strColor;
}

export function randomColorArray(n: number): string[] {
  const randomColors = Array(n);
  for (let i = 0; i < n; i++) {
    randomColors[i] = randomColor();
  }
  return randomColors;
}
