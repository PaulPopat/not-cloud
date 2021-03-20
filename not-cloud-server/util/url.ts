function Trim(s: string, c: string) {
  if (c === "]") c = "\\]";
  if (c === "^") c = "\\^";
  if (c === "\\") c = "\\\\";
  return s.replace(new RegExp("^[" + c + "]+|[" + c + "]+$", "g"), "");
}

export function BuildUrlWithDomain(domain: string, ...parts: string[]) {
  return encodeURI(
    [Trim(domain, "/"), ...parts.map((p) => Trim(p, "/"))].join("/")
  );
}
