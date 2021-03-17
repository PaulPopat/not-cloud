import React from "react";
import { IsString } from "@paulpopat/safe-type";

export type Unpromise<T extends Promise<any>> = T extends Promise<infer U>
  ? U
  : never;

export function UseAsync<T>(initial: () => Promise<T>) {
  const state = React.useState<T>();

  React.useEffect(() => {
    initial().then(state[1]);
  }, [true]);

  return state;
}

export function Classes(
  ...names: (
    | NodeJS.Dict<boolean | null | undefined | number | string>
    | string
  )[]
) {
  const result = [] as string[];

  for (const item of names) {
    if (IsString(item)) {
      result.push(item);
      continue;
    }

    for (const key in item) {
      if (item[key]) {
        result.push(key);
      }
    }
  }

  return result.join(" ");
}

function IsOS() {
  return navigator.userAgent.match(/ipad|iphone/i);
}

function FallbackCopyTextToClipboard(text: string) {
  const textarea = document.createElement("textarea");
  textarea.readOnly = true;
  (textarea as any).contentEditable = true;
  textarea.value = text;
  document.body.appendChild(textarea);
  if (IsOS()) {
    const range = document.createRange();
    range.selectNodeContents(textarea);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    textarea.setSelectionRange(0, 999999);
  } else {
    textarea.select();
  }

  try {
    document.execCommand("copy");
    return "success" as const;
  } catch (e) {
    console.error(e);
    return e as Error;
  } finally {
    document.body.removeChild(textarea);
  }
}

export async function CopyString(text: string) {
  if (!navigator.clipboard) {
    return FallbackCopyTextToClipboard(text);
  }
  try {
    await navigator.clipboard.writeText(text);
    return "success" as const;
  } catch (e) {
    console.error(e);
    return e as Error;
  }
}

export function FormatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function LoadScript(src: string) {
  return new Promise<void>((res, rej) => {
    var script = document.createElement("script");
    script.onload = function () {
      res();
    };
    script.src = src;

    document.head.appendChild(script);
  });
}
