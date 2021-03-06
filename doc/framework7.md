Framework7 Study Guildline
===

> This page is part of the [wohApp Devlopment Guidline](dev.md)

# App HTML Layout
```
<!DOCTYPE html>
<html>
  <head>
    <!-- Required meta tags-->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, minimal-ui, viewport-fit=cover">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <!-- Color theme for statusbar -->
    <meta name="theme-color" content="#2196f3">
    <!-- Your app title -->
    <title>My App</title>
    <!-- Path to Framework7 Library CSS -->
    <link rel="stylesheet" href="path/to/framework7.min.css">
    <!-- Path to your custom app styles-->
    <link rel="stylesheet" href="path/to/my-app.css">
  </head>
  <body>
    <!-- App root element -->
    <div id="app">
      <!-- Statusbar overlay -->
      <div class="statusbar"></div>

      <!-- Your main view, should have "view-main" class -->
      <div class="view view-main">
        <!-- Initial Page, "data-name" contains page name -->
        <div data-name="home" class="page">

          <!-- Top Navbar -->
          <div class="navbar">
            <div class="navbar-inner">
              <div class="title">Awesome App</div>
            </div>
          </div>

          <!-- Toolbar -->
          <div class="toolbar">
            <div class="toolbar-inner">
              <!-- Toolbar links -->
              <a href="#" class="link">Link 1</a>
              <a href="#" class="link">Link 2</a>
            </div>
          </div>

          <!-- Scrollable page content -->
          <div class="page-content">
            <p>Page content goes here</p>
            <!-- Link to another page -->
            <a href="/about/">About app</a>
          </div>
        </div>
      </div>
    </div>
    <!-- Path to Framework7 Library JS-->
    <script type="text/javascript" src="path/to/framework7.min.js"></script>
    <!-- Path to your app js-->
    <script type="text/javascript" src="path/to/my-app.js"></script>
  </body>
</html>
```

# Initialize App:my-app.js
```
var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'My App',
  // App id
  id: 'com.myapp.test',
  // Enable swipe panel
  panel: {
    swipe: 'left',
  },
  // Add default routes
  routes: [
    {
      path: '/about/',
      url: 'about.html',
    },
  ],
  // ... other parameters
});
```

# event:
```
var app = new Framework7({
  ...
  on: {
    // each object key means same name event handler
    pageInit: function (page) {
      // do something on page init
    },
    popupOpen: function (popup) {
      // do something on popup open
    },
  },
});

var popup = app.popup.create({
  ...
  on: {
    open: function (popup) {
      // do something on popup open
    }
  }
})
```

# routers
```
var app = new Framework7({
  routes: [
    {
      name: 'about',
      path: '/about/',
      url: './pages/about.html',
    },
    {
      name: 'news',
      path: '/news/',
      url: './pages/news.html',
      options: {
        animate: false,
      },
    },
    {
      name: 'users',
      path: '/users/',
      templateUrl: './pages/users.html',
      options: {
        context: {
          users: ['John Doe', 'Vladimir Kharlampidi', 'Timo Ernst'],
        },
      },
      on: {
        pageAfterIn: function (e, page) {
          // do something after page gets into the view
        },
        pageInit: function (e, page) {
          // do something when page initialized
        },
      }
    },
    // Default route, match to all pages (e.g. 404 page)
    {
      path: '(.*)',
      url: './pages/404.html',
    },
  ],
});
```

#router component:
```
routes = [
  // ...
  {
    path: '/some-page/',
    // Component Object
    component: {
      template: `
        <div class="page">
          <div class="navbar">
            <div class="navbar-inner">
              <div class="title">{{title}}</div>
            </div>
          </div>
          <div class="page-content">
            <a @click="openAlert" class="red-link">Open Alert</a>
            <div class="list simple-list">
              <ul>
                {{#each names}}
                  <li>{{this}}</li>
                {{/each}}
              </ul>
            </div>
          </div>
        </div>
      `,
      style: `
        .red-link {
          color: red;
        }
      `,
      data: function () {
        return {
          title: 'Component Page',
          names: ['John', 'Vladimir', 'Timo'],
        }
      },
      methods: {
        openAlert: function () {
          var self = this;
          self.$app.dialog.alert('Hello world!');
        },
      },
      on: {
        pageInit: function (e, page) {
          // do something on page init
        },
        pageAfterOut: function (e, page) {
          // page has left the view
        },
      }
    },
  },
  // ...
]
```

# view layout
```
<body>
  <!-- app root -->
  <div id="app">
    <!-- view inside of panel -->
    <div class="panel panel-left panel-cover">
      <div class="view panel-view"> ... </div>
    </div>
    <!-- Your main view -->
    <div class="view view-main">
      <!-- View related pages -->
      ...
    </div>
    <div class="popup">
      <div class="view popup-view"> ... </div>
    </div>
  </div>
</body>
```

# Multiple Views Layout
```
<body>
  <!-- app root -->
  <div id="app">
    <!-- view inside of panel -->
    <div class="panel panel-left panel-cover">
      <div class="view panel-view"> ... </div>
    </div>
    <!-- Views container -->
    <div class="views tabs">
      <!-- Your main view -->
      <div class="view view-main tab tab-active" id="view-1">
        <!-- View related pages -->
        ...
      </div>
      <!-- Another view -->
      <div class="view tab" id="view-2">
        <!-- View related pages -->
        ...
      </div>
      ...
    </div>
    <div class="popup">
      <div class="view popup-view"> ... </div>
    </div>
  </div>
</body>
```

# App Methods & Properties
```
var app = new Framework7({
  id: 'com.myapp.test',
  // Extended by Panel component:
  panel: {
    swipe: 'left',
    leftBreakpoint: 768,
    rightBreakpoint: 1024,
  },
  // Extended by Dialog component:
  dialog: {
    title: 'My App',
  },
  // Extended by Statusbar component:
  statusbar: {
    iosOverlaysWebview: true,
  },
});

// Open panel
app.panel.open('left');

// Hide statusbar
app.statusbar.hide();


app.on('panelOpen', function (panel) {
  console.log('Panel ' + panel.side + ' opened');
});
```

# Accordion Layout
```
<div class="accordion-list">
    <div class="accordion-item">
        <div class="accordion-item-toggle">...</div>
        <div class="accordion-item-content">...</div>
    </div>
    <div class="accordion-item accordion-item-opened">
        <div class="accordion-item-toggle">...</div>
        <div class="accordion-item-content">...</div>
    </div>
    <div class="accordion-item">
        <div class="accordion-item-toggle">...</div>
        <div class="accordion-item-content">...</div>
    </div>
    ...
</div>
```

# actions:
```
var app = new Framework7({
  actions: {
    convertToPopover: false,
    grid: true,
  }
});
```

# autocomplete
```
var autocomplete = app.autocomplete.create({
  inputEl: '#autocomplete-dropdown',
  openIn: 'dropdown',
  source: function (query, render) {
    ...
  }
});
```

# Dom7
```
//Export DOM7 to local variable to make it easy accessable
var $$ = Dom7;
$$('.something').on('click', function (e) {
    $$(this).addClass('hello').attr('title', 'world').insertAfter('.something-else');
});
```

# template7
```
// Initialize app
var app = new Framework7();

var $$ = Dom7;

// Compile templates once on app load/init
var searchTemplate = $$('script#search-template').html();
var compiledSearchTemplate = Template7.compile(searchTemplate);

var listTemplate = $$('script#list-template').html();
var compiledListTemplate = Template7.compile(listTemplate);

// That is all, now and further just execute compiled templates with required context
app.on('pageInit', function (page) {
    // Just execute compiled search template with required content:
    var html = compiledSearchTemplate({/*...some data...*/});

    // Do something with html...
});
```

#plugin
```
var myPlugin = {
  // Module Name
  name: 'demo-module',
  /* Install callback
  It will be executed right after component is installed
  Context of this callback points to Class where it was installed
  */
  install() {
    const Class = this;
    console.log(Class);
  },
  /* Create callback
  It will be executed in the very beginning of class initilization (when we create new instance of the class)
  */
  create(instance) {
    console.log('init', instance);
  },
  /*
  Object with default class/plugin parameters
  */
  params: {
    myPlugin: {
      a: 1,
      b: 2,
      c: 3,
    }
  },
  /* proto object extends Class prototype */
  proto: {
    demo() {
      return 'demo-module-proto-method';
    },
    demoStatic: 'demo-module-proto-static',
  },
  // Extend Class with static props and methods, e.g. Class.myMethod
  static: {
    demo() {
      return 'demo-module-class-method';
    },
    demoStatic: 'demo-module-class-static',
  },
  /* Initialized instance Props & Methods */
  instance: {
    demoProp: true,
    demoMethod() {
      return 'demo-method';
    },
  },
  /* Event handlers */
  on: {
    demoEvent(a, b) {
      console.log('demo-event', a, b);
    },
  },
  /* Handle clicks */
  clicks: {
    // prop name means CSS selector of element to add click handler
    'p': function ($clickedEl, data) {
      // $clickedEl: Dom7 instance of clicked element
      // data: element data set (data- attributes)
    },
  }
};

Framework7.use(myPlugin);
```