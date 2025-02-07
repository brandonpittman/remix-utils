import { useLocation, useMatches } from "@remix-run/react";
import type { AppData, LinkDescriptor } from "@remix-run/server-runtime";
import { HandleConventionArguments } from "./handle-conventions";

export interface DynamicLinksFunction<Data extends AppData = AppData> {
  (args: HandleConventionArguments<Data>): LinkDescriptor[];
}

export function DynamicLinks() {
  let location = useLocation();

  let links: LinkDescriptor[] = useMatches().flatMap(
    (match, index, matches) => {
      let fn = match.handle?.dynamicLinks as DynamicLinksFunction | undefined;
      if (typeof fn !== "function") return [];
      let result = fn({
        id: match.id,
        data: match.data,
        params: match.params,
        location,
        parentsData: matches.slice(0, index).map((match) => match.data),
      });
      if (Array.isArray(result)) return result;
      return [];
    }
  );

  return (
    <>
      {links.map((link) => (
        <link {...link} key={link.integrity || JSON.stringify(link)} />
      ))}
    </>
  );
}
