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
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
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
