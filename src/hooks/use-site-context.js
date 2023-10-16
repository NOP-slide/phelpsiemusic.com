import { useContext } from "react";

import { SiteContext } from "../context";

function useSiteContext() {
  return useContext(SiteContext);
}

export { useSiteContext };