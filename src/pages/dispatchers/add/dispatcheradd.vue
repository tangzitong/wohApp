<template>
  <f7-page class="dispatcher">
    <f7-navbar :title="$t('dispatcher.add')" :back-link="$t('app.back')"></f7-navbar>
    <f7-block>
      <h3>{{$t('dispatcher.add')}}</h3>
      <transition name="fade">
        <p v-if="showSuccess" class="success">{{$t('dispatcher.complete')}}</p>
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
    <f7-block v-if="isUserLogin">
      <f7-button big raised color="green" fill @click="updateDispatcher">{{$t('dispatcher.add')}}</f7-button>
    </f7-block>
      <!-- Image uploader component -->
    <f7-block v-if="isUserLogin">
      <imageuploader
        :store="'dispatchers/' + userid"
        :db="'dispatchers/' + userid + '/photo'" />
    </f7-block>

    <!-- Image -->
    <f7-block inset v-if="photo">
      <img :src="photo" width="50%" />
    </f7-block>
</f7-page>
</template>

<script>
import imageuploader from '../../../popup/imageuploader'
import { getIndustryConfig, getAreaConfig } from '@/code'

export default {
  data() {
    return {
      id: null,
      name: '',
      address: '',
      Tel: '',
      Fax: '',
      Manager: '',
      HP: '',
      showSuccess: null,
      photo: null,
      dispatchertype: '',
      industry: '1',
      area: '1',
      isUserLogin: !!window.user,
      userid: null
    }
  },
  created() {
    this.area = getAreaConfig()
    this.industry = getIndustryConfig()
  },
  // Update user name, title and photo from Firebase
  mounted: function () {
    const query = this.$f7route.query
    this.id = query.mid
    this.dispatchertype = query.dispatchertype
    if (this.isUserLogin) {
      this.userid = window.user.uid
    }
    if (this.id) {
      this.$root.chat.getDispatcherByKey(this.id, data => {
        if (data) {
          this.name = data.name
          this.address = data.address
          this.Tel = data.Tel
          this.Fax = data.Fax
          this.Manager = data.Manager
          this.HP = data.HP
          this.photo = data.photo
        }
      })
    }
  },
  methods: {
    updateDispatcher() {
      if (this.id) {
        this.$root.chat.updateDispatcher(this.id, {
          name: this.name,
          address: this.address,
          Tel: this.Tel,
          Fax: this.Fax,
          Manager: this.Manager,
          HP: this.HP,
          photo: this.photo,
          dispatchertype: this.dispatchertype,
          area: this.area,
          industry: this.industry
        }, function(dispatcherKey) {
          console.log('update success')
        })
      } else {
        this.$root.chat.createDispatcher({
          name: this.name,
          address: this.address,
          Tel: this.Tel,
          Fax: this.Fax,
          Manager: this.Manager,
          HP: this.HP,
          photo: this.photo,
          dispatchertype: this.dispatchertype,
          area: this.area,
          industry: this.industry
        }, function(dispatcherKey) {
          console.log('add success')
        })
      }

      this.name = ''
      this.address = ''
      this.Tel = ''
      this.Fax = ''
      this.Manager = ''
      this.HP = ''
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
