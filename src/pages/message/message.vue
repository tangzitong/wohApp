<template>
  <f7-page class="message-page" messages-content>
    <f7-navbar :title="nickname" :back-link="$t('app.back')"></f7-navbar>
    <f7-messages ref="messages">
      <f7-messages-title><b>Sunday, Feb 9,</b> 12:58</f7-messages-title>
      <f7-message
        v-for="(message, index) in messagesData"
        :key="index"
        :type="message.type"
        :text="message.message"
        :image="message.image"
        :name="message.name"
        :avatar="message.userId"
        :first="isFirstMessage(message, index)"
        :last="isLastMessage(message, index)"
        :tail="isTailMessage(message, index)"
      ></f7-message>
    </f7-messages>
    <f7-messagebar ref="messagebar" :placeholder="$t('message.placeholder')" :send-link="$t('app.send')" @submit="sendMessage"></f7-messagebar>
  </f7-page>
</template>

<style lang="less">
.message-page {
  .message:not(.message-last) .message-avatar {
    opacity: 1;
  }
}
</style>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      // Response in progress flag
      responseInProgress: false
    }
  },
  computed: {
    ...mapState({
      messagesData: state => state.roommessages,
      people: state => state.roomusers,
    }),
    nickname: function() {
      const query = this.$f7route.query
      return query.name || this.$t('app.chat')
    },
    roomid: function() {
      const query = this.$f7route.query
      return query.id
    }
  },
  mounted() {
    this.enterRoom()
    this.getRoomMessages()
    this.getRoomUsers()
    this.receiveMessages()
  },
  methods: {
    enterRoom() {
      window.roomid = this.roomid
      window.messageReceived = false
      this.$root.chat.enterRoom(this.roomid)
    },
    getRoomMessages() {
      this.$f7.preloader.show()
      this.$root.chat.getRoomMessages(this.roomid, function(roommessages) {
        for (const messageid in roommessages) {
          if (window.user.uid === roommessages[messageid].userId) {
            roommessages[messageid].type = 'sent'
          } else {
            roommessages[messageid].type = 'received'
          }
        }
        window.store.dispatch('initRoomMessages', roommessages)
      })
      this.$f7.preloader.hide()
    },
    getRoomUsers() {
      this.$f7.preloader.show()
      this.$root.chat.getUsersByRoom(this.roomid, function(roomusers) {
        window.store.dispatch('initRoomUsers', roomusers)
      })
      this.$f7.preloader.hide()
    },
    receiveMessages() {
      this.$root.chat.on('message-add', function(roomid, message) {
        if (roomid === window.roomid && !window.messageReceived) {
          if (window.user.uid === message.userId) {
            message.type = 'sent'
          } else {
            message.type = 'received'
          }
          window.store.dispatch('infiniteRoomMessages', message)
          window.messageReceived = true
          setTimeout(function () {
            window.messageReceived = false
          }, 1000)
        }
      })
    },
    // Messages rules for correct styling
    isFirstMessage(message, index) {
      const self = this
      const previousMessage = self.messagesData[index - 1]
      if (message.isTitle) return false
      if (
        !previousMessage ||
        previousMessage.type !== message.type ||
        previousMessage.name !== message.name
      ) {
        return true
      }
      return false
    },
    isLastMessage(message, index) {
      const self = this
      const nextMessage = self.messagesData[index + 1]
      if (message.isTitle) return false
      if (!nextMessage ||
        nextMessage.type !== message.type ||
        nextMessage.name !== message.name
      ) {
        return true
      }
      return false
    },
    isTailMessage(message, index) {
      const self = this
      const nextMessage = self.messagesData[index + 1]
      if (message.isTitle) return false
      if (
        !nextMessage ||
        nextMessage.type !== message.type ||
        nextMessage.name !== message.name
      ) {
        return true
      }
      return false
    },
    sendMessage() {
      const self = this
      const text = self.messagebar
        .getValue()
        .replace(/\n/g, '<br>')
        .trim()

      if (text.length === 0) {
        // exit when empty messagebar text is empty
        return
      }

      // Clear messagebar area
      self.messagebar.clear()

      // Focus area
      if (text.length) self.messagebar.focus()

      this.$root.chat.sendMessage(this.roomid, text, 'messageType')
    },
    onF7Ready() {
      const self = this
      // References to us APIs
      self.messagebar = self.$refs.messagebar.f7Messagebar
      self.messages = self.$refs.messages.f7Messages
    }
  }
}
</script>
