<template>
  <f7-page class="company">
    <f7-navbar :title="$t('company.add')" :back-link="$t('app.back')"></f7-navbar>
    <f7-block>
      <h3>{{$t('company.HP')}}</h3>
      <transition name="fade">
        <p v-if="showSuccess" class="success">{{$t('companyadd.complete')}}</p>
      </transition>
      <f7-list>
        <f7-list-item>
          <form @submit.prevent>
            <f7-list-item>
              <label for="name">{{$t('company.name')}}</label>
              <input type="text" :placeholder="$t('company.name_')" @input="name = $event.target.value" />
            </f7-list-item>
            <f7-list-item>
              <label for="address">{{$t('company.address')}}</label>
              <input type="text" :placeholder="$t('company.address_')" @input="address = $event.target.value" />
            </f7-list-item>
            <f7-list-item>
              <label for="Tel">{{$t('company.Tel')}}</label>
              <input type="text" :placeholder="$t('company.Tel_')" @input="Tel = $event.target.value" />
            </f7-list-item>
            <f7-list-item>
              <label for="Fax">{{$t('company.Fax')}}</label>
              <input type="text" :placeholder="$t('company.Fax_')" @input="Fax = $event.target.value" />
            </f7-list-item>
            <f7-list-item>
              <label for="Manager">{{$t('company.Manager')}}</label>
              <input type="text" :placeholder="$t('company.Manager_')" @input="Manager = $event.target.value" />
            </f7-list-item>
            <f7-list-item>
              <label for="HP">{{$t('company.HP')}}</label>
              <input type="text" :placeholder="$t('company.HP_')" @input="HP = $event.target.value" />
            </f7-list-item>
            <f7-list-item>
              <label for="like">{{$t('company.like')}}</label>
              <input type="text" :placeholder="$t('company.noNewestCompany')" @input="noNewestCompany = $event.target.value" />
            </f7-list-item>
           </form>
        </f7-list-item>
      </f7-list>
    </f7-block>
    <f7-block v-if="$root.user">
      <a @click="updateProfile">{{$t('companyadd.btn')}}</a>
    </f7-block>
      <!-- Image uploader component -->
    <f7-block v-if="$root.user">
      <imageuploader
        :store="'companys/' + $root.user.uid"
        :db="'companys/' + $root.user.uid + '/photo'" />
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
    window.db('users/' + window.user.uid).on('value', snapshot => {
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
    ...mapState(['userProfile'])
  },
  methods: {
    updateProfile() {
      this.$store.dispatch('updateProfile', {
        name: this.name !== '' ? this.name : this.userProfile.name,
        title: this.title !== '' ? this.title : this.userProfile.title,
        photo: this.photo !== '' ? this.photo : this.userProfile.photo
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
