<template>
  <f7-page class="tool">
    <f7-navbar :title="$t('tool.add')" :back-link="$t('app.back')"></f7-navbar>
    <f7-block>
      <h3>{{$t('tool.add')}}</h3>
      <transition name="fade">
        <p v-if="showSuccess" class="success">{{$t('tooladd.complete')}}</p>
      </transition>
    </f7-block>
    <f7-list form @submit.prevent>
      <f7-list-item>
        <label>{{$t('tool.name')}}</label><br/>
        <input type="text" :placeholder="$t('tool.name_')" @input="name = $event.target.value" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('tool.address')}}</label><br/>
        <input type="text" :placeholder="$t('tool.address_')" @input="address = $event.target.value" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('tool.Tel')}}</label><br/>
        <input type="text" :placeholder="$t('tool.Tel_')" @input="Tel = $event.target.value" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('tool.Fax')}}</label><br/>
        <input type="text" :placeholder="$t('tool.Fax_')" @input="Fax = $event.target.value" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('tool.Manager')}}</label><br/>
        <input type="text" :placeholder="$t('tool.Manager_')" @input="Manager = $event.target.value" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('tool.HP')}}</label><br/>
        <input type="text" :placeholder="$t('tool.HP_')" @input="HP = $event.target.value" />
      </f7-list-item>
    </f7-list>
    <f7-block v-if="$root.user">
      <f7-button big raised color="green" fill @click="updateTool">{{$t('tool.add')}}</f7-button>
    </f7-block>
      <!-- Image uploader component -->
    <f7-block v-if="$root.user">
      <imageuploader
        :store="'tools/' + $root.user.uid"
        :db="'tools/' + $root.user.uid + '/photo'" />
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
    window.db('tools/' + window.user.uid).on('value', snapshot => {
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
    ...mapState(['updateTool'])
  },
  methods: {
    updateTool() {
      this.$store.dispatch('updateTool', {
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
