export default function getMap (items, property) {
  return items.reduce((map, item) => {
    const key = item[property]
    if (key === null) { return map }
    if (!map[key]) {
      map[key] = item
    }
    return map
  }, {})
}
