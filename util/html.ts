import { IsString } from "@paulpopat/safe-type";

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
  //can use a better detection logic here
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
