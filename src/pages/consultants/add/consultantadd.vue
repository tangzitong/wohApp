<template>
  <f7-page class="consultant">
    <f7-navbar :title="$t('consultant.add')" :back-link="$t('app.back')"></f7-navbar>
    <f7-block>
      <h3>{{$t('consultant.add')}}</h3>
      <transition name="fade">
        <p v-if="showSuccess" class="success">{{$t('consultant.complete')}}</p>
      </transition>
    </f7-block>
    <f7-list form @submit.prevent>
      <f7-list-item>
        <label>{{$t('consultant.name')}}</label><br/>
        <input type="text" :placeholder="$t('consultant.name_')" @input="name = $event.target.value" :value="name" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('consultant.address')}}</label><br/>
        <input type="text" :placeholder="$t('consultant.address_')" @input="address = $event.target.value" :value="address" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('consultant.Tel')}}</label><br/>
        <input type="text" :placeholder="$t('consultant.Tel_')" @input="Tel = $event.target.value" :value="Tel" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('consultant.Fax')}}</label><br/>
        <input type="text" :placeholder="$t('consultant.Fax_')" @input="Fax = $event.target.value" :value="Fax" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('consultant.Manager')}}</label><br/>
        <input type="text" :placeholder="$t('consultant.Manager_')" @input="Manager = $event.target.value" :value="Manager" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('consultant.HP')}}</label><br/>
        <input type="text" :placeholder="$t('consultant.HP_')" @input="HP = $event.target.value" :value="HP" />
      </f7-list-item>
    </f7-list>
    <f7-block v-if="isUserLogin">
      <f7-button big raised color="green" fill @click="updateConsultant">{{$t('consultant.add')}}</f7-button>
    </f7-block>
      <!-- Image uploader component -->
    <f7-block v-if="isUserLogin">
      <imageuploader
        :store="'consultants/' + userid"
        :db="'consultants/' + userid + '/photo'" />
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
      consultanttype: '',
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
    this.consultanttype = query.consultanttype
    if (this.isUserLogin) {
      this.userid = window.user.uid
    }
    if (this.id) {
      this.$root.chat.getConsultantByKey(this.id, data => {
        if (data) {
          this.name = data.name
          this.address = data.address
          this.Tel = data.Tel
          this.Fax = data.Fax
          this.Manager = data.Manager
          this.HP = data.HP
          this.photo = data.photo
          this.consultanttype = data.consultanttype
        }
      })
    }
  },
  methods: {
    updateConsultant() {
      if (this.id) {
        this.$root.chat.updateConsultant(this.id, {
          name: this.name,
          address: this.address,
          Tel: this.Tel,
          Fax: this.Fax,
          Manager: this.Manager,
          HP: this.HP,
          photo: this.photo,
          consultanttype: this.consultanttype,
          area: this.area,
          industry: this.industry
        }, function(consultantKey) {
          console.log('update success')
        })
      } else {
        this.$root.chat.createConsultant({
          name: this.name,
          address: this.address,
          Tel: this.Tel,
          Fax: this.Fax,
          Manager: this.Manager,
          HP: this.HP,
          photo: this.photo,
          consultanttype: this.consultanttype,
          area: this.area,
          industry: this.industry
        }, function(consultantKey) {
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
