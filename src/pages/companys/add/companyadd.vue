<template>
  <f7-page class="company">
    <f7-navbar :title="$t('company.add')" :back-link="$t('app.back')"></f7-navbar>
    <f7-block>
      <h3>{{$t('company.add')}}</h3>
      <transition name="fade">
        <p v-if="showSuccess" class="success">{{$t('company.complete')}}</p>
      </transition>
    </f7-block>
    <f7-list form @submit.prevent>
      <f7-list-item>
        <label>{{$t('company.name')}}</label><br/>
        <input type="text" :placeholder="$t('company.name_')" @input="name = $event.target.value" :value="name" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('company.introduce')}}</label><br/>
        <input type="textarea" :placeholder="$t('company.introduce_')" @input="introduce = $event.target.value" :value="introduce" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('company.address')}}</label><br/>
        <input type="text" :placeholder="$t('company.address_')" @input="address = $event.target.value" :value="address" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('company.Tel')}}</label><br/>
        <input type="text" :placeholder="$t('company.Tel_')" @input="Tel = $event.target.value" :value="Tel" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('company.Fax')}}</label><br/>
        <input type="text" :placeholder="$t('company.Fax_')" @input="Fax = $event.target.value" :value="Fax" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('company.Manager')}}</label><br/>
        <input type="text" :placeholder="$t('company.Manager_')" @input="Manager = $event.target.value" :value="Manager" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('company.HP')}}</label><br/>
        <input type="text" :placeholder="$t('company.HP_')" @input="HP = $event.target.value" :value="HP" />
      </f7-list-item>
    </f7-list>
    <f7-block v-if="isUserLogin">
      <f7-button big raised color="green" fill @click="updateCompany">{{$t('company.add')}}</f7-button>
    </f7-block>
      <!-- Image uploader component -->
    <f7-block v-if="isUserLogin && id">
      <imageuploader
        :store="'companys/' + userid + '/' + id"
        :db="'companys/data/' + id + '/photo'" />
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
      introduce: '',
      address: '',
      Tel: '',
      Fax: '',
      Manager: '',
      HP: '',
      showSuccess: null,
      photo: null,
      companytype: '',
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
    this.companytype = query.companytype
    if (this.isUserLogin) {
      this.userid = window.user.uid
    }
    if (this.id) {
      this.$root.chat.getCompanyByKey(this.id, data => {
        if (data) {
          this.name = data.name
          this.introduce = data.introduce
          this.address = data.address
          this.Tel = data.Tel
          this.Fax = data.Fax
          this.Manager = data.Manager
          this.HP = data.HP
          this.photo = data.photo
          this.companytype = data.companytype
        }
      })
    }
  },
  methods: {
    updateCompany() {
      if (this.id) {
        this.$root.chat.updateCompany(this.id, {
          name: this.name,
          introduce: this.introduce,
          address: this.address,
          Tel: this.Tel,
          Fax: this.Fax,
          Manager: this.Manager,
          HP: this.HP,
          photo: this.photo,
          companytype: this.companytype,
          area: this.area,
          industry: this.industry
        }, function(companyKey) {
          console.log('update success')
        })
      } else {
        this.$root.chat.createCompany({
          name: this.name,
          introduce: this.introduce,
          address: this.address,
          Tel: this.Tel,
          Fax: this.Fax,
          Manager: this.Manager,
          HP: this.HP,
          photo: this.photo,
          companytype: this.companytype,
          area: this.area,
          industry: this.industry
        }, function(companyKey) {
          console.log('add success')
        })
      }

      this.name = ''
      this.introduce = ''
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
