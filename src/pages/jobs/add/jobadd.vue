<template>
  <f7-page class="jobadd-page">
    <f7-navbar :title="$t('job.add')" :back-link="$t('app.back')">
      <f7-nav-right>
        <f7-link :text="$t('app.save')"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-block-title>{{$t('job.add')}}</f7-block-title>
    <f7-list inline-labels no-hairlines-md>
      <f7-list-item>
        <f7-input v-bind:value="username" placeholder="Gebruikersnaam" type="text"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <f7-label>Gebruikersnaam</f7-label>
        <f7-input v-model="username" placeholder="Gebruikersnaam" type="text"></f7-input>
      </f7-list-item>
      <f7-list-input name="name" label="Name"
                     type="text"
                     placeholder="Your name"
                     clear-button>
        <f7-icon icon="icon-language" slot="media"></f7-icon>
      </f7-list-input>

      <f7-list-input label="Password"
                     type="password"
                     placeholder="Your password"
                     clear-button>
        <f7-icon icon="icon-language" slot="media"></f7-icon>
      </f7-list-input>

      <f7-list-input label="E-mail"
                     type="email"
                     placeholder="Your e-mail"
                     clear-button>
        <f7-icon icon="icon-language" slot="media"></f7-icon>
      </f7-list-input>

      <f7-list-input label="URL"
                     type="url"
                     placeholder="URL"
                     clear-button>
        <f7-icon icon="icon-language" slot="media"></f7-icon>
      </f7-list-input>

      <f7-list-input label="Phone"
                     type="tel"
                     placeholder="Your phone number"
                     clear-button>
        <f7-icon icon="icon-language" slot="media"></f7-icon>
      </f7-list-input>

      <f7-list-input label="Gender"
                     type="select"
                     defaultValue="Male"
                     placeholder="Please choose...">
        <f7-icon icon="icon-language" slot="media"></f7-icon>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </f7-list-input>

      <f7-list-input label="Birthday"
                     type="date"
                     defaultValue="2014-04-30"
                     placeholder="Please choose...">
        <f7-icon icon="icon-language" slot="media"></f7-icon>
      </f7-list-input>

      <f7-list-input label="Date time"
                     type="datetime-local"
                     placeholder="Please choose...">
        <f7-icon icon="icon-language" slot="media"></f7-icon>
      </f7-list-input>

      <f7-list-input label="Range"
                     :input="false">
        <f7-icon icon="icon-language" slot="media"></f7-icon>
        <f7-range slot="input" :value="50" :min="0" :max="100" :step="1"></f7-range>
      </f7-list-input>

      <f7-list-input label="Textarea"
                     type="textarea"
                     placeholder="Bio">
        <f7-icon icon="icon-language" slot="media"></f7-icon>
      </f7-list-input>

      <f7-list-input label="Resizable"
                     type="textarea"
                     resizable
                     placeholder="Bio">
        <f7-icon icon="icon-language" slot="media"></f7-icon>
      </f7-list-input>
    </f7-list>
  </f7-page>
</template>
