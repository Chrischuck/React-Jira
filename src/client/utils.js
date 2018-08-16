export const isOldView = (name, url) => {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export const getUrlParam = (param, url) => {
  const codedParam = (new RegExp(param + '=([^&]*)')).exec(url)[1];
  return decodeURIComponent(codedParam);
}

export const getQueryParam = (param, url) => {
  const name = param.replace(/[\[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

export const getTicketName = url => {
  const spl = url.split('/')
  const last = spl[spl.length - 1]
  const [ id, rest ] = last.split('?') 
  return id
}