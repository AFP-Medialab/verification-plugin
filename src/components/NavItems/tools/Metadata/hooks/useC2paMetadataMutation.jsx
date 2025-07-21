import { useMutation } from "@tanstack/react-query";

import { getC2paDataHd } from "@/components/NavItems/tools/C2pa/Hooks/useGetC2paData";

export const useC2paMetadataMutation = (options = {}) => {
  return useMutation({
    mutationFn: getC2paDataHd,
    ...options,
  });
};
