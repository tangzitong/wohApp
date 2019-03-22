Languages Files
===

> This page is part of the [wohApp Devlopment Guidline](dev.md)

<br />

Languages files provide a simple way to make your app multi-lingual.

## Storage

Language files should be saved in folder *src/i18n/lang/*.js. They should be JS files with plain key:string pairs.

Example:

`lang/en_us.js`
```
{
    home: 'Home',
    contacts: 'Contacts',
}
```

`lang/ja_jp.js`
```
{
    home: 'トップ',
    contacts: '連絡簿',
}
```

`lang/zh_cn.js`
```
{
    home: '首页',
    contacts: '联系人',
}
```

After you added a new language file, the development server should be restarted.

## Usage

In templates:
- `{{$t('emailSubject')}}`
- `{{$t('emailBody', {username: 'Bugs Bunny'})`

In scripts:
- `this.$t('emailSubject')`
- `this.$t('emailBody', {username: 'Bugs Bunny'})`
