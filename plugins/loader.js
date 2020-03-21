export default (data, inject) => {
  inject('loader', {
    async load() {
      return {
        test: 2
      }
    }
  })
}
