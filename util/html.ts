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
  const text_area = document.createElement("textarea");
  text_area.value = text;

  // Avoid scrolling to bottom
  text_area.style.top = "0";
  text_area.style.left = "0";
  text_area.style.position = "fixed";

  document.body.appendChild(text_area);
  text_area.focus();
  text_area.select();

  try {
    document.execCommand("copy");
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(text_area);
}

export function CopyString(text: string) {
  if (!navigator.clipboard) {
    FallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    () => {},
    (err) => {
      console.error("Async: Could not copy text: ", err);
    }
  );
}
