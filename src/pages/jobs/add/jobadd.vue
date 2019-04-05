<template>
  <f7-page class="job">
    <f7-navbar :title="$t('job.add')" :back-link="$t('app.back')"></f7-navbar>
    <f7-block>
      <h3>{{$t('job.add')}}</h3>
      <transition name="fade">
        <p v-if="showSuccess" class="success">{{$t('job.complete')}}</p>
      </transition>
    </f7-block>
    <f7-list form @submit.prevent>
      <f7-list-item>
        <label>{{$t('job.name')}}</label><br/>
        <input type="text" :placeholder="$t('job.name_')" @input="name = $event.target.value" :value="name" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('job.address')}}</label><br/>
        <input type="text" :placeholder="$t('job.address_')" @input="address = $event.target.value" :value="address" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('job.Tel')}}</label><br/>
        <input type="text" :placeholder="$t('job.Tel_')" @input="Tel = $event.target.value" :value="Tel" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('job.Fax')}}</label><br/>
        <input type="text" :placeholder="$t('job.Fax_')" @input="Fax = $event.target.value" :value="Fax" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('job.Manager')}}</label><br/>
        <input type="text" :placeholder="$t('job.Manager_')" @input="Manager = $event.target.value" :value="Manager" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('job.HP')}}</label><br/>
        <input type="text" :placeholder="$t('job.HP_')" @input="HP = $event.target.value" :value="HP" />
      </f7-list-item>
    </f7-list>
    <f7-block v-if="isUserLogin">
      <f7-button big raised color="green" fill @click="updateJob">{{$t('job.add')}}</f7-button>
    </f7-block>
      <!-- Image uploader component -->
    <f7-block v-if="isUserLogin">
      <imageuploader
        :store="'jobs/' + userid"
        :db="'jobs/' + userid + '/photo'" />
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
      jobtype: '',
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
    this.jobtype = query.jobtype
    if (this.isUserLogin) {
      this.userid = window.user.uid
    }
    if (this.id) {
      this.$root.chat.getJobByKey(this.id, data => {
        if (data) {
          this.name = data.name
          this.address = data.address
          this.Tel = data.Tel
          this.Fax = data.Fax
          this.Manager = data.Manager
          this.HP = data.HP
          this.photo = data.photo
          this.jobtype = data.jobtype
        }
      })
    }
  },
  methods: {
    updateJob() {
      if (this.id) {
        this.$root.chat.updateJob(this.id, {
          name: this.name,
          address: this.address,
          Tel: this.Tel,
          Fax: this.Fax,
          Manager: this.Manager,
          HP: this.HP,
          photo: this.photo,
          jobtype: this.jobtype,
          area: this.area,
          industry: this.industry
        }, function(jobKey) {
          console.log('update success')
        })
      } else {
        this.$root.chat.createJob({
          name: this.name,
          address: this.address,
          Tel: this.Tel,
          Fax: this.Fax,
          Manager: this.Manager,
          HP: this.HP,
          photo: this.photo,
          jobtype: this.jobtype,
          area: this.area,
          industry: this.industry
        }, function(jobKey) {
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
