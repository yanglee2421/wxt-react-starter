declare module "aedes-persistence-redis" {
  const fn: () => import("aedes").Persistence;
  export default fn;
}
