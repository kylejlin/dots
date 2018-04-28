export default (array) => {
  let i = 0;
  while (true) {
    if (!array.includes(i)) {
      return i
    }
    i++
  }
}
