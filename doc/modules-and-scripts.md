Modules and Scripts
===

> This page is part of the [wohApp Devlopment Guidline](dev.md)


<br />

If available, you should prefer npm modules to keep your project folder lightweight.

## NPM module

Follow these steps to install and use a module from the [npm repository](https://www.npmjs.com/):

1. Install module with `npm install --save-dev <package_name>`
2. Import module at the beginning of the script block with `import <var_name> from '<package_name>'`

Example: `npm install --save-dev underscore`

```
<script>

  import _ from 'underscore'

  export default {
    mounted: function () {
      let numbers = [1, 4, 34, 145]
      window.f7.alert('In my list are ' + _.size(numbers) + ' numbers!')
    }
  }
  
</script>
```