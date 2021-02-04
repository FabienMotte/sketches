export const getQueryParam = (name: string) => {
  const urlQueryParams = new URLSearchParams(window.location.search)
  return urlQueryParams.get(name)
}
