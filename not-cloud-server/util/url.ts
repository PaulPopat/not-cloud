function Trim(s: string, c: string) {
  let result = s;
  while (result.startsWith(c)) {
    result = result.substr(1);
  }

  while (result.endsWith(c)) {
    result = result.substring(0, result.length - 1);
  }

  return result;
}

export function BuildUrlWithDomain(domain: string, ...parts: string[]) {
  return encodeURI(
    [Trim(domain, "/"), ...parts.map((p) => Trim(p, "/"))].join("/")
  );
}

export function BuildUrl(...parts: string[]) {
  return encodeURI(
    "/" +
      parts
        .map((p) => Trim(p, "/"))
        .filter((p) => p)
        .join("/")
  );
}

export function WithParameters(
  url: string,
  params: NodeJS.Dict<string | number | (string | number)[]>
) {
  const query = Object.keys(params)
    .map((k) => {
      const part = params[k];
      return (Array.isArray(part) ? part : [part ?? ""])
        .map((p) => p.toString())
        .map((p) => encodeURIComponent(k) + "=" + encodeURIComponent(p))
        .join("&");
    })
    .join("&");
  if (url.includes("?")) {
    return url + "&" + query;
  }

  return url + "?" + query;
}
