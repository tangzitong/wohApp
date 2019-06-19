<template>
  <div class="home-view">
    <div class="homebanner">
      <img src="https://i7.photobucket.com/albums/y255/akira_kaka/woh/img_banner1.png" value="banner">
    </div>
    <div class="classify">
      <div class="classify-f">
      <div class="cf" value="frontprogram" v-on:click="viewKnowledgetype('1')">
        <img src="https://i7.photobucket.com/albums/y255/akira_kaka/woh/img_qianduan.png" style="width:45px;height:45px">
        <span class="classify-txt">{{$t('knowledge.knowledgetype1')}}</span>
      </div>
      <div class="cf" value="moblieprogram" v-on:click="viewKnowledgetype('2')">
        <img src="https://i7.photobucket.com/albums/y255/akira_kaka/woh/img_yidong.png" style="width:45px;height:45px">
        <span class="classify-txt">{{$t('knowledge.knowledgetype2')}}</span>
      </div>
      <div class="cf" value="codeprogram" v-on:click="viewKnowledgetype('3')">
        <img src="https://i7.photobucket.com/albums/y255/akira_kaka/woh/img_biancheng.png" style="width:45px;height:45px">
        <span class="classify-txt">{{$t('knowledge.knowledgetype3')}}</span>
      </div>
      <div class="cf" value="vbprogram" v-on:click="viewKnowledgetype('4')">
        <img src="https://i7.photobucket.com/albums/y255/akira_kaka/woh/img_yunwei.png" style="width:45px;height:45px">
        <span class="classify-txt">{{$t('knowledge.knowledgetype4')}}</span>
      </div>
      </div>
      <div class="classify-f" style="margin-top:20px">
      <div class="cf" value="datebprogram" v-on:click="viewKnowledgetype('5')">
        <img src="https://i7.photobucket.com/albums/y255/akira_kaka/woh/img_shujuku.png" style="width:45px;height:45px">
        <span class="classify-txt">{{$t('knowledge.knowledgetype5')}}</span>
      </div>
      <div class="cf" value="Designprogram" v-on:click="viewKnowledgetype('6')">
        <img src="https://i7.photobucket.com/albums/y255/akira_kaka/woh/img_shuju.png" style="width:45px;height:45px">
        <span class="classify-txt">{{$t('knowledge.knowledgetype6')}}</span>
      </div>
      <div class="cf" value="proprogram" v-on:click="viewKnowledgetype('7')">
        <img src="https://i7.photobucket.com/albums/y255/akira_kaka/woh/img_xiangmu.png" style="width:45px;height:45px">
        <span class="classify-txt">{{$t('knowledge.knowledgetype7')}}</span>
      </div>
      <div class="cf" value="aiprogram" v-on:click="viewKnowledgetype('8')">
        <img src="https://i7.photobucket.com/albums/y255/akira_kaka/woh/img_rengongzhineng.png" style="width:45px;height:45px">
        <span class="classify-txt">{{$t('knowledge.knowledgetype8')}}</span>
      </div>
      </div>
    </div>

    <div class="Bouticlass" v-if="!isUserLogin">
      <div class="bouti-title">
        <div class="head-point"></div><div class="classtit">{{$t('app.excellent')}}</div>
      </div>
      <div class="classtestlist">
        <div class="classtest" v-on:click="viewKnowledge('-LdLtaiBADqiIat-6k_9')">
          <img src="https://i7.photobucket.com/albums/y255/akira_kaka/woh/img_classcover01.png" style="width:168px;height:102px">
          <div class="cl-test-tit" v-on:click="viewKnowledge('-LdLtaiBADqiIat-6k_9')">
            <span class="classttitle">{{$t('knowledge.knowledge1')}}</span>
            <button class="tryit">{{$t('app.trystudy')}}</button>
          </div>
        </div>
        <div class="classtest" v-on:click="viewKnowledge('-LbYZZXvYQxtpo2AWpzL')">
          <img src="https://i7.photobucket.com/albums/y255/akira_kaka/woh/img_classcover01.png" style="width:168px;height:102px">
          <div class="cl-test-tit" v-on:click="viewKnowledge('-LbYZZXvYQxtpo2AWpzL')">
            <span class="classttitle">{{$t('knowledge.knowledge2')}}</span>
            <button class="tryit">{{$t('app.trystudy')}}</button>
          </div>
        </div>
        <div class="classtest" v-on:click="viewKnowledge('-LdLubY6J4gW1t94t63x')">
          <img src="https://i7.photobucket.com/albums/y255/akira_kaka/woh/img_classcover01.png" style="width:168px;height:102px">
          <div class="cl-test-tit" v-on:click="viewKnowledge('-LdLubY6J4gW1t94t63x')">
            <span class="classttitle">{{$t('knowledge.knowledge3')}}</span>
            <button class="tryit">{{$t('app.trystudy')}}</button>
          </div>
        </div>
        <div class="classtest" v-on:click="viewKnowledge('-Ld495mtWIyObJzEEK7s')">
          <img src="https://i7.photobucket.com/albums/y255/akira_kaka/woh/img_classcover01.png" style="width:168px;height:102px">
          <div class="cl-test-tit" v-on:click="viewKnowledge('-Ld495mtWIyObJzEEK7s')">
            <span class="classttitle">{{$t('knowledge.knowledge4')}}</span>
            <button class="tryit">{{$t('app.trystudy')}}</button>
          </div>
        </div>
      </div>
    </div>

    <f7-list v-if="isUserLogin">
      <f7-list-group v-for="knowledge_ in knowledges" :key="knowledge_.id">
        <f7-list-item :link="getLink(knowledge_.id)"
          :value="knowledge_.id"
          :title="knowledge_.name"
          :after="$t('app.study')">
          <i class="f7-icons size-25" slot="media">book_fill</i>
          </f7-list-item>
      </f7-list-group>
    </f7-list>
    <f7-list v-if="isUserLogin">
      <f7-list-item :title="$t('app.knowledgetype')" link="/knowledge/type/?isowner=false">
        <i class="f7-icons size-25" slot="media">book_fill</i>
      </f7-list-item>
    </f7-list>
  </div>
</template>

<style lang="less" scoped>
.home-view {
  .list {
    margin: 15px 0;
    .iconfont {
      height: 29px;
    }
    .icon-knowledges {
      color: #ff0c33;
    }
  }
}
.homebanner{
  background:rgb(21,33,39);
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
      line-height:27px;
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
    justify-content: space-around;
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
        padding:0 4px;
        .classttitle{
          color:#666;
          font-size:14px;
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
</style>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      knowledges: state => state.applicationknowledges,
      isUserLogin: state => state.isUserLogin
    })
  },
  mounted() {
    if (!this.isUserLogin) {
      this.openLogin()
    }
    if (this.isUserLogin) {
      this.getKnowledges()
    }
  },
  methods: {
    ...mapActions([
      'updatePopup'
    ]),
    getKnowledges() {
      this.$f7.preloader.show()
      this.$root.chat.getKnowledgeListByApplication(function(applicationknowledges) {
        window.store.dispatch('initApplicationKnowledges', applicationknowledges)
      })
      this.$f7.preloader.hide()
    },
    viewKnowledgetype(knowledgetype) {
      this.$f7router.navigate(`/knowledge/?knowledgetype=${knowledgetype}&isowner=false`)
    },
    viewKnowledge(id) {
      this.$f7router.navigate(`/knowledge/?mid=${id}&isowner=false&istry=true`)
    },
    openLogin() {
      this.updatePopup({
        key: 'loginOpened',
        value: true
      })
    },
    getLink(id) {
      return `/knowledge/?mid=${id}&isowner=false`
    }
  }
}
</script>
