export default ([clientX, clientY], svg) => {
  const viewBox = svg.viewBox.baseVal
  const rect = svg.getBoundingClientRect()
  const width = rect.right - rect.left
  const height = rect.bottom - rect.top

  const xScale = viewBox.width / width
  const yScale = viewBox.height / height

  const localX = Math.round((clientX - rect.left) * xScale)
  const localY = Math.round((clientY - rect.top) * yScale)

  return [localX, localY]
}
