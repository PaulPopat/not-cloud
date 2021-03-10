import { ExtensionMap } from "./file-extensions";

export function GetFileLink(type: "file" | "directory", download_url: string) {
  if (type === "directory") {
    return {
      href: `/files/${encodeURI(download_url)}`,
      type: "internal" as const,
      original: download_url,
    };
  }

  if (download_url.endsWith(".ncloud") || download_url.endsWith(".docx")) {
    return {
      href: `/documents/${encodeURI(download_url)}`,
      type: "internal" as const,
      original: download_url,
    };
  }

  const split = download_url.split(".");
  const mapped = ExtensionMap(split[split.length - 1]);
  if (mapped === "image" || mapped === "video" || mapped === "speaker") {
    const parts = download_url.split("/");
    const file_name = parts[parts.length - 1];
    const dir = parts.slice(0, parts.length - 1).join("/");
    return {
      href: `/files/${encodeURI(dir)}?view=${encodeURIComponent(file_name)}`,
      type: "internal" as const,
      original: download_url,
    };
  }

  return {
    href: `/api/files/download/${encodeURI(download_url)}`,
    type: "external" as const,
    original: download_url,
  };
}
