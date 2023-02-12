export const isRequired = (name) => {
  throw new Error(`${name} is required`)
}
