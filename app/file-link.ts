export function GetFileLink(type: "file" | "directory", download_url: string) {
  if (type === "directory") {
    return {
      href: `/files/${download_url}`,
      type: "internal" as const,
      original: download_url,
    };
  }

  if (download_url.endsWith(".ncloud") || download_url.endsWith(".docx")) {
    return {
      href: `/documents/${download_url}`,
      type: "internal" as const,
      original: download_url,
    };
  }

  return {
    href: `/api/files/download/${download_url}`,
    type: "external" as const,
    original: download_url,
  };
}
