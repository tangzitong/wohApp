<template>
  <!-- App -->
  <div id="app" v-cloak>
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
    <f7-popup :opened="knowledgecommentPopupOpened">
      <knowledgecomment-popup></knowledgecomment-popup>
    </f7-popup>
    <f7-popup :opened="applicationPopupOpened">
      <application-popup></application-popup>
    </f7-popup>
    <f7-popup :opened="loginPopupOpened">
      <login-popup></login-popup>
    </f7-popup>
  </div>
</template>

<script>
import PublisherPopup from './popup/publisher'
import CommentPopup from './popup/comment'
import KnowledgecommentPopup from './popup/knowledgecomment'
import ApplicationPopup from './popup/application'
import LoginPopup from './popup/login'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      publisherPopupOpened: state => state.popup.publisherOpened,
      commentPopupOpened: state => state.popup.commentOpened,
      knowledgecommentPopupOpened: state => state.popup.knowledgecommentOpened,
      applicationPopupOpened: state => state.popup.applicationOpened,
      loginPopupOpened: state => state.popup.loginOpened
    }),
  },
  components: {
    PublisherPopup,
    CommentPopup,
    KnowledgecommentPopup,
    ApplicationPopup,
    LoginPopup
  }
}
</script>
