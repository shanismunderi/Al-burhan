import { O as useRouter, r as reactExports, a as isRedirect, a5 as createServerFn } from "./server-D0MjzJls.mjs";
import { c as createSsrRpc } from "./client-BSypI-SM.mjs";
import { o as objectType, s as stringType, n as numberType } from "./types-BoWyrJuk.mjs";
function useServerFn(serverFn) {
  const router = useRouter();
  return reactExports.useCallback(async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) throw res;
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router.stores.location.get();
        return router.navigate(router.resolveRedirect(err).options);
      }
      throw err;
    }
  }, [router, serverFn]);
}
const seedAdmin = createServerFn({
  method: "POST"
}).handler(createSsrRpc("9b0f428ff611b1c405020e7e66d720a4bd80c1126fdb00280d5026c9fcb82e92"));
const accessCodeSchema = stringType().min(4).max(16).regex(/^[A-Z0-9]+$/, "Use A–Z and 0–9 only");
const createParticipantSchema = objectType({
  member1_name: stringType().min(1).max(120),
  member2_name: stringType().min(1).max(120),
  access_code: stringType().optional()
});
const createParticipant = createServerFn({
  method: "POST"
}).inputValidator((d) => {
  const parsed = createParticipantSchema.safeParse(d);
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message || "Invalid input data");
  }
  return parsed.data;
}).handler(createSsrRpc("9989dc1615c9fc2591a13f9bc19a82bf76b73e03a4bd36664323a99403b6d314"));
const updateAccessCode = createServerFn({
  method: "POST"
}).inputValidator((d) => {
  const parsed = objectType({
    user_id: stringType().uuid(),
    access_code: accessCodeSchema
  }).safeParse(d);
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message || "Invalid input data");
  }
  return parsed.data;
}).handler(createSsrRpc("2fc3d0678c31e1968563f9e2fd85c10e9366fde8c2f17ea546ae46d4afaf8a0a"));
const deleteParticipant = createServerFn({
  method: "POST"
}).inputValidator((d) => objectType({
  user_id: stringType().uuid()
}).parse(d)).handler(createSsrRpc("d9912b15e1ea1341d2ec4534b60682878ef88a68ddd80df45fbcd1d9be5ac155"));
const gradeAnswer = createServerFn({
  method: "POST"
}).inputValidator((d) => objectType({
  answer_id: stringType().uuid(),
  manual_score: numberType().min(0).max(1e3)
}).parse(d)).handler(createSsrRpc("e2f1499293b2618cb12a4927c2a42fb831523244ae9aa3d21e29b0894de34e51"));
export {
  updateAccessCode as a,
  createParticipant as c,
  deleteParticipant as d,
  gradeAnswer as g,
  seedAdmin as s,
  useServerFn as u
};
