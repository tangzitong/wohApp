export function getRemoteAvatar(id) {
  return 'https://firebasestorage.googleapis.com/v0/b/wohapp-3a179.appspot.com/o/android-icon-xxhdpi-144x144.png?alt=media&token=d6e43d58-52c6-4ed6-ac2d-d68072d5a12a'
}

export function isAndroid() {
  const userAgent = navigator.userAgent || ''
  const appVersion = navigator.appVersion || ''
  const vendor = navigator.vendor || ''
  let ua = userAgent + ' ' + appVersion + ' ' + vendor
  ua = ua.toLowerCase()

  let reg = 'android'
  if (ua.indexOf('android') >= 0) {
    reg = /\bandroid[ /-]?([0-9.x]+)?/
  } else if (ua.indexOf('adr') >= 0) {
    if (ua.indexOf('mqqbrowser') >= 0) {
      reg = /\badr[ ]\(linux; u; ([0-9.]+)?/
    } else {
      reg = /\badr(?:[ ]([0-9.]+))?/
    }
  }
  return new RegExp(reg).test(ua)
}
