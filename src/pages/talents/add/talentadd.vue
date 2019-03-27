<template>
  <f7-page class="talent">
    <f7-navbar :title="$t('talent.add')" :back-link="$t('app.back')"></f7-navbar>
    <f7-block>
      <h3>{{$t('talent.add')}}</h3>
      <transition name="fade">
        <p v-if="showSuccess" class="success">{{$t('talentadd.complete')}}</p>
      </transition>
    </f7-block>
    <f7-list form @submit.prevent>
      <f7-list-item>
        <label>{{$t('talent.name')}}</label><br/>
        <input type="text" :placeholder="$t('talent.name_')" @input="name = $event.target.value" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('talent.address')}}</label><br/>
        <input type="text" :placeholder="$t('talent.address_')" @input="address = $event.target.value" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('talent.Tel')}}</label><br/>
        <input type="text" :placeholder="$t('talent.Tel_')" @input="Tel = $event.target.value" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('talent.Fax')}}</label><br/>
        <input type="text" :placeholder="$t('talent.Fax_')" @input="Fax = $event.target.value" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('talent.Manager')}}</label><br/>
        <input type="text" :placeholder="$t('talent.Manager_')" @input="Manager = $event.target.value" />
      </f7-list-item>
      <f7-list-item>
        <label>{{$t('talent.HP')}}</label><br/>
        <input type="text" :placeholder="$t('talent.HP_')" @input="HP = $event.target.value" />
      </f7-list-item>
    </f7-list>
    <f7-block v-if="$root.user">
      <f7-button big raised color="green" fill @click="updateTalent">{{$t('talent.add')}}</f7-button>
    </f7-block>
      <!-- Image uploader component -->
    <f7-block v-if="$root.user">
      <imageuploader
        :store="'talents/' + $root.user.uid"
        :db="'talents/' + $root.user.uid + '/photo'" />
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
      like: 0,
      showSuccess: null,
      photo: null,
      talenttype: '',
      industry: '1',
      area: '1'
    }
  },
  created() {
    this.area = getAreaConfig()
    this.industry = getIndustryConfig()
  },
  // Update user name, title and photo from Firebase
  mounted: function () {
    if (this.id) {
      window.db('talents/' + window.user.uid + '/' + this.id).on('value', snapshot => {
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
          this.talenttype = data.talenttype
        }
      })
    }
  },
  computed: {
    ...mapState(['updateTalent'])
  },
  methods: {
    updateTalent() {
      if (this.id) {
        this.$store.dispatch('updateTalent', {
          id: this.id,
          name: this.name,
          address: this.address,
          Tel: this.Tel,
          Fax: this.Fax,
          Manager: this.Manager,
          HP: this.HP,
          like: this.like,
          photo: this.photo,
          talenttype: this.talenttype,
          area: this.area,
          industry: this.industry
        })
      } else {
        this.$store.dispatch('addTalent', {
          name: this.name,
          address: this.address,
          Tel: this.Tel,
          Fax: this.Fax,
          Manager: this.Manager,
          HP: this.HP,
          like: this.like,
          photo: this.photo,
          talenttype: this.talenttype,
          area: this.area,
          industry: this.industry
        })
      }

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
