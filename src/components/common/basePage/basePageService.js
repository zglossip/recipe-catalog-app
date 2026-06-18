import { useRouter } from "vue-router";

export const INJECTION_KEY = Symbol();

export function useBasePageService() {
  const router = useRouter();

  function navigateHome() {
    router.push("/");
  }

  return {
    navigateHome,
  };
}
