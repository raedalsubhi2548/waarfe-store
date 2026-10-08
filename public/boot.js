// admin.rraed.com: hide the store's pre-rendered page before the first paint (the dashboard takes over).
if (/^admin\./.test(location.hostname)) document.documentElement.classList.add('admin-host')
