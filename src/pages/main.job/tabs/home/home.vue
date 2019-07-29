<template>
  <div class="home-view">
    <f7-list class="homebanner">
      <img src="https://github.com/highwayns/lohmd2n/blob/master/banner.jpg?raw=true" value="banner">
    </f7-list>
     <div class="classify">
      <div class="classify-f">
        <div class="cf" value="nomal" v-on:click="viewJobtype('1')">
          <img src="@/assets/images/img_qianduan.png" style="width:45px;height:45px">
          <span class="classify-txt">{{$t('job.nomal')}}</span>
        </div>
        <div class="cf" value="contact" v-on:click="viewJobtype('2')">
          <img src="@/assets/images/img_yidong.png" style="width:45px;height:45px">
          <span class="classify-txt">{{$t('job.contact')}}</span>
        </div>
        <div class="cf" value="arbeit" v-on:click="viewJobtype('3')">
          <img src="@/assets/images/img_biancheng.png" style="width:45px;height:45px">
          <span class="classify-txt">{{$t('job.arbeit')}}</span>
        </div>
        <div class="cf" value="dspatch" v-on:click="viewJobtype('4')">
          <img src="@/assets/images/img_yunwei.png" style="width:45px;height:45px">
          <span class="classify-txt">{{$t('job.dspatch')}}</span>
        </div>
      </div>
    </div>
    <div class="myclass" v-if="isUserLogin">
      <div class="bouti-title">
        <div class="head-point"></div><div class="classtit">{{$t('job.myjob')}}</div>
        <div class="moreclass" v-on:click="viewJobtypes()">{{$t('job.morejob')}}</div>
      </div>
    </div>
    <!--f7-list>
      <f7-list-group v-for="job_ in jobs" :key="job_.id">
        <f7-list-item :link="getLink(job_.id)"
          :value="job_.id"
          :title="job_.name">
          <i class="f7-icons size-25" slot="media">book_fill</i>
          </f7-list-item>
      </f7-list-group>
    </f7-list>
    <f7-list>
      <f7-list-item :title="$t('app.jobtype')" link="/job/type/?isowner=false">
        <i class="f7-icons size-25" slot="media">book_fill</i>
      </f7-list-item>
    </f7-list-->
    <f7-list v-if="!isUserLogin">
      <f7-list-item :title="$t('login.titleSignIn')">
        <i class='iconfont icon-ios7arrowright' slot="media"></i>
        <a @click="openLogin">{{$t('login.titleSignIn')}}</a>
      </f7-list-item>
    </f7-list>
  </div>
</template>

<style lang="less" scoped>
.homebanner{
  background:linear-gradient(#333c49, #1b222d);
  margin-bottom: 4px;
  img{
    max-width:100%;
    max-height:100%;
    display: block;
    margin: auto;
  }
}
.classify{
  display: flex;
  flex-direction: column;
  //align-items: center;
  margin: 20px 0;
  .classify-f{
    display: flex;
    justify-content: space-around;
    .cf{
      margin:0 12px 0;
      display: flex;
      flex-direction: column;
      //justify-content: center;
      align-items: center;
    }
    .classify-txt{
      font-size:13px;
      margin-top: 8px;
      text-align: center;
      width: 72px;
      color: #333;
    }
  }
}
.Bouticlass, .myclass{
  background: #fff;
  max-width: 100%;
  padding: 10px;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  margin-bottom: 12px;
  .bouti-title{
    display: inline-flex;
    align-items: center;
    margin-left: 6px;
    .head-point{
      background-color: #0a94ed;
      width:6px;
      height: 16px;
      border-radius:6px;
    }
    .classtit{
      margin-left: 14px;
      font-size: 16px;
      color: #666;
    }
    .moreclass{
      font-size: 13px;
      color:#0a94ed;
      position: absolute;
      right: 16px;
    }
  }
  .classtestlist{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .classtest{
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: 6px 4px 8px;
      .cl-test-tit{
        margin-top:8px;
        width: 168px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding:0 4px;
        .classttitle{
          color:#666;
          font-size:14px;
          width: 7em;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        .tryit{
          width:52px;
          height:24px;
          border-style: none;
          border-radius:6px;
          background-color: #f65e40;
          color:#fff;
          font-size: 13px;
        }
      }
    }
  }
}
.home-view {
  .list {
    margin: 15px 0;
    .iconfont {
      height: 29px;
    }
    .icon-jobs {
      color: #ff0c33;
    }
  }
}

</style>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      jobs: state => state.applicationjobs,
      isUserLogin: state => state.isUserLogin
    })
  },
  mounted() {
    if (!this.isUserLogin) {
      this.openLogin()
    }
    if (this.isUserLogin) {
      this.getJobs()
    }
  },
  methods: {
    ...mapActions([
      'updatePopup'
    ]),
    getJobs() {
      this.$f7.preloader.show()
      this.$root.chat.getJobListByApplication(function(applicationjobs) {
        window.store.dispatch('initApplicationJobs', applicationjobs)
      })
      this.$f7.preloader.hide()
    },
    openLogin() {
      this.updatePopup({
        key: 'loginOpened',
        value: true
      })
    },
    getLink(id) {
      return `/job/?mid=${id}&isowner=false`
    },
    viewJobtype(jobtype) {
      this.$f7router.navigate(`/job/?jobtype=${jobtype}&isowner=false`)
    },
    viewJobtypes() {
      this.$f7router.navigate(`/jobs/type/?isowner=false`)
    },
    viewJob(id) {
      this.$f7router.navigate(`/jobs/?mid=${id}&isowner=false&istry=false`)
    },
  }
}
</script>
