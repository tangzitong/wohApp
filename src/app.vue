<template>
  <!-- App -->
  <div id="app">

    <!-- Statusbar -->
    <f7-statusbar></f7-statusbar>

    <!-- Main View -->
    <f7-view id="main-view" url="/" main color-theme="orange"></f7-view>

    <!-- Comment, publisher Popup -->
    <f7-popup :opened="publisherPopupOpened">
      <publisher-popup></publisher-popup>
    </f7-popup>
    <f7-popup :opened="commentPopupOpened">
      <comment-popup></comment-popup>
    </f7-popup>
    <f7-popup :opened="applicationPopupOpened">
      <application-popup></application-popup>
    </f7-popup>
    <f7-popup :opened="loginPopupOpened">
      <login-popup></login-popup>
    </f7-popup>
    <f7-popup :opened="imageUploaderPopupOpened">
      <imageuploader-popup></imageuploader-popup>
    </f7-popup>
  </div>
</template>

<script>
import PublisherPopup from './popup/publisher'
import CommentPopup from './popup/comment'
import ApplicationPopup from './popup/application'
import LoginPopup from './popup/login'
import ImageUploaderPopup from './popup/imageuploader'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      publisherPopupOpened: state => state.popup.publisherOpened,
      commentPopupOpened: state => state.popup.commentOpened,
      applicationPopupOpened: state => state.popup.applicationOpened,
      loginPopupOpened: state => state.popup.loginOpened,
      imageUploaderPopupOpened: state => state.popup.imageUploaderOpened
    }),
  },
  components: {
    PublisherPopup,
    CommentPopup,
    ApplicationPopup,
    LoginPopup,
    ImageUploaderPopup
  }
}
</script>
