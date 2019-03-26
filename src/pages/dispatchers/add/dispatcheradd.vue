<template>
  <f7-page class="dispatcher">
    <f7-navbar :title="$t('dispatcher.add')" :back-link="$t('app.back')"></f7-navbar>
    <f7-block>
      <h3>{{$t('dispatcher.add')}}</h3>
      <transition name="fade">
        <p v-if="showSuccess" class="success">{{$t('dispatcheradd.complete')}}</p>
      </transition>
    </f7-block>
    <f7-list form @submit.prevent>
      <f7-list-item>
        <label>{{$t('dispatcher.name')}}</label><br/>
        <input type="text" :placeholder="$t('dispatcher.name_')" @input="name = $event.target.value" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('dispatcher.address')}}</label><br/>
        <input type="text" :placeholder="$t('dispatcher.address_')" @input="address = $event.target.value" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('dispatcher.Tel')}}</label><br/>
        <input type="text" :placeholder="$t('dispatcher.Tel_')" @input="Tel = $event.target.value" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('dispatcher.Fax')}}</label><br/>
        <input type="text" :placeholder="$t('dispatcher.Fax_')" @input="Fax = $event.target.value" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('dispatcher.Manager')}}</label><br/>
        <input type="text" :placeholder="$t('dispatcher.Manager_')" @input="Manager = $event.target.value" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('dispatcher.HP')}}</label><br/>
        <input type="text" :placeholder="$t('dispatcher.HP_')" @input="HP = $event.target.value" />
      </f7-list-item>
    </f7-list>
    <f7-block v-if="$root.user">
      <f7-button big raised color="green" fill @click="updateDispatcher">{{$t('dispatcher.add')}}</f7-button>
    </f7-block>
      <!-- Image uploader component -->
    <f7-block v-if="$root.user">
      <imageuploader
        :store="'dispatchers/' + $root.user.uid"
        :db="'dispatchers/' + $root.user.uid + '/photo'" />
    </f7-block>

    <!-- Image -->
    <f7-block inset v-if="photo">
      <img :src="photo" width="50%" />
    </f7-block>
</f7-page>
</template>

<script>
import { mapState } from 'vuex'
import imageuploader from '../../../popup/imageuploader'

export default {
  data() {
    return {
      name: '',
      address: '',
      Tel: '',
      Fax: '',
      Manager: '',
      HP: '',
      like: '',
      showSuccess: null,
      photo: null,
    }
  },
  // Update user name, title and photo from Firebase
  mounted: function () {
    window.db('dispatchers/' + window.user.uid).on('value', snapshot => {
      const data = snapshot.val()
      if (data) {
        this.name = data.name
        this.address = data.address
        this.Tel = data.Tel
        this.Fax = data.Fax
        this.Manager = data.Manager
        this.HP = data.HP
        this.like = data.like
        this.photo = data.photo
      }
    })
  },
  computed: {
    ...mapState(['updateDispatcher'])
  },
  methods: {
    updateDispatcher() {
      this.$store.dispatch('updateDispatcher', {
        name: this.name,
        address: this.address,
        Tel: this.Tel,
        Fax: this.Fax,
        Manager: this.Manager,
        HP: this.HP,
        like: this.like,
        photo: this.photo
      })

      this.name = ''
      this.address = ''
      this.Tel = ''
      this.Fax = ''
      this.Manager = ''
      this.HP = ''
      this.like = ''
      this.photo = ''
      this.showSuccess = true

      setTimeout(() => { this.showSuccess = false }, 2000)
    }
  },
  components: {
    imageuploader
  }
}
</script>
