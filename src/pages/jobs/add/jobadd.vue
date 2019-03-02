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
        <i class='iconfont icon-language' slot="media"></i>
        <f7-label>{{$t('job.title')}}</f7-label>
        <f7-input v-bind:value="Title" :placeholder="$t('job.title_')" type="text"></f7-input>
      </f7-list-item>
      <f7-list-item>
        <i class='iconfont icon-language' slot="media"></i>
        <f7-label>{{$t('job.content')}}</f7-label>
        <textarea type="textarea" :placeholder="$t('job.content_')" value="Content" v-model="editText"></textarea>
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>
