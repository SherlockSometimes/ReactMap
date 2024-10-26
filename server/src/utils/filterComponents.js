// @ts-check
/**
 * Recursively filter out components based on donor or freeloader status
 * @param {import("@rm/types").CustomComponent[]} components
 * @param {boolean} loggedIn
 * @param {boolean} donor
 * @returns {import("@rm/types").CustomComponent[]}
 */
function filterComponents(components, loggedIn, donor) {
  return (Array.isArray(components) ? components : []).filter((component) => {
    if ('components' in component && Array.isArray(component.components)) {
      return filterComponents(component.components, loggedIn, donor).length > 0
    }
    if (
      !component.donorOnly &&
      !component.freeloaderOnly &&
      !component.loggedInOnly &&
      !component.loggedOutOnly
    )
      return true

    return (
      (component.donorOnly && donor) ||
      (component.freeloaderOnly && !donor) ||
      (component.loggedInOnly && loggedIn) ||
      (component.loggedOutOnly && !loggedIn)
    )
  })
}

module.exports = { filterComponents }
