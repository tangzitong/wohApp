<template>
  <f7-page class="event">
    <f7-navbar :title="$t('event.add')" :back-link="$t('app.back')"></f7-navbar>
    <f7-block>
      <h3>{{$t('event.add')}}</h3>
      <transition name="fade">
        <p v-if="showSuccess" class="success">{{$t('event.complete')}}</p>
      </transition>
    </f7-block>
    <f7-list form @submit.prevent>
      <f7-list-item>
        <label>{{$t('event.name')}}</label><br/>
        <input type="text" :placeholder="$t('event.name_')" @input="name = $event.target.value" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('event.address')}}</label><br/>
        <input type="text" :placeholder="$t('event.address_')" @input="address = $event.target.value" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('event.Tel')}}</label><br/>
        <input type="text" :placeholder="$t('event.Tel_')" @input="Tel = $event.target.value" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('event.Fax')}}</label><br/>
        <input type="text" :placeholder="$t('event.Fax_')" @input="Fax = $event.target.value" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('event.Manager')}}</label><br/>
        <input type="text" :placeholder="$t('event.Manager_')" @input="Manager = $event.target.value" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('event.HP')}}</label><br/>
        <input type="text" :placeholder="$t('event.HP_')" @input="HP = $event.target.value" />
      </f7-list-item>
    </f7-list>
    <f7-block v-if="isUserLogin">
      <f7-button big raised color="green" fill @click="updateEvent">{{$t('event.add')}}</f7-button>
    </f7-block>
      <!-- Image uploader component -->
    <f7-block v-if="isUserLogin">
      <imageuploader
        :store="'events/' + userid"
        :db="'events/' + userid + '/photo'" />
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
      eventtype: '',
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
    this.eventtype = query.eventtype
    if (this.isUserLogin) {
      this.userid = window.user.uid
    }
    if (this.id) {
      this.$root.chat.getEventByKey(this.id, data => {
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
    updateEvent() {
      if (this.id) {
        this.$root.chat.updateEvent(this.id, {
          name: this.name,
          address: this.address,
          Tel: this.Tel,
          Fax: this.Fax,
          Manager: this.Manager,
          HP: this.HP,
          photo: this.photo,
          eventtype: this.eventtype,
          area: this.area,
          industry: this.industry
        }, function(eventKey) {
          console.log('update success')
        })
      } else {
        this.$root.chat.createEvent({
          name: this.name,
          address: this.address,
          Tel: this.Tel,
          Fax: this.Fax,
          Manager: this.Manager,
          HP: this.HP,
          photo: this.photo,
          eventtype: this.eventtype,
          area: this.area,
          industry: this.industry
        }, function(eventKey) {
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
