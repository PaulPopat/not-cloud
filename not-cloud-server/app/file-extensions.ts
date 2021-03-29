import { IconName } from "../common/atoms";

const Map: NodeJS.Dict<IconName> = {
  json: "file-text",
  md: "file-text",
  docx: "file-text",
  ncloud: "file-text",
  apng: "image",
  avif: "image",
  gif: "image",
  jpg: "image",
  jpeg: "image",
  jfif: "image",
  pjpeg: "image",
  pjp: "image",
  png: "image",
  svg: "image",
  webp: "image",
  bmp: "image",
  ico: "image",
  cur: "image",
  mp4: "video",
  mov: "video",
  avi: "video",
  webm: "video",
  ogg: "video",
  "3g2": "video",
  wav: "speaker",
  m4a: "speaker",
  mp3: "speaker",
  aif: "speaker",
  aiff: "speaker",
};

export function ExtensionMap(name: string) {
  const split = name.split(".");
  const extension = split[split.length - 1];
  return Map[extension.toLowerCase()];
}
