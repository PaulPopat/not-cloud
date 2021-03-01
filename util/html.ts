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

function FallbackCopyTextToClipboard(text: string) {
  const el = document.createElement("textarea");
  el.value = text;

  // Avoid scrolling to bottom
  el.style.top = "0";
  el.style.left = "0";
  el.style.position = "fixed";
  el.contentEditable = "true";
  el.readOnly = false;

  document.body.appendChild(el);
  el.focus();
  el.select();

  try {
    document.execCommand("copy");
    return true;
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
    return false;
  } finally {
    document.body.removeChild(el);
  }
}

export async function CopyString(text: string) {
  if (!navigator.clipboard) {
    return FallbackCopyTextToClipboard(text);
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
