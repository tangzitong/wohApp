<template>
  <f7-page class="download-page">
    <f7-navbar :title="$t('app.download')" :back-link="$t('app.back')"></f7-navbar>
    <f7-block class="logo">
        <img src="@/assets/images/img_logo.png" alt="logo" style="width: 75px;height: 75px;">
        <div class="app-name">wohApp</div>
    </f7-block>
    <f7-block class="detail">
        <p>Guildline</p>
        <button class="download1">Student Guildline</button>
        <button class="download1" v-on:click="viewKnowledge('-LedXZi8fzaKO45rL-Kv')">Teacher Guildline</button>
        <button class="download1" v-on:click="viewKnowledge('-Ld495mtWIyObJzEEK7s')">System Developer Guildline</button>
        <button class="download1" >System Maintenance Guildline</button>
    </f7-block>
    <f7-block class="detail">
        <p>Desktop Application Download</p>
        <a href="https://github.com/highwayns/lohmd2n/blob/master/download/electron/windows/wohApp%20Setup%204.0.0.z01?raw=true" class="download1">Windows Download(part1)</a>
        <a href="https://github.com/highwayns/lohmd2n/blob/master/download/electron/windows/wohApp%20Setup%204.0.0.zip?raw=true" class="download1">Windows Download(part2)</a>
        <button href="" class="download1">Linux Download</button>
        <button href="" class="download1">Mac Download</button>
    </f7-block>
    <f7-block class="detail">
        <p>Browser Application Download</p>
        <button class="download1">Nodejs Install</button>
        <button class="download1">Cordova Install</button>
        <a href="https://github.com/highwayns/lohmd2n/blob/master/download/browser/browser.zip?raw=true" class="download1">Browser Application</a>
    </f7-block>
    <f7-block class="detail">
        <p>Smartphone App Download</p>
        <div class="osan_down">
        <img src="@/assets/images/img_app_store.png" alt="iOs_download" style="width:200px">
        <img src="@/assets/images/img_google_play.png" alt="Android_download" style="width:200px">
        </div>
    </f7-block>
    <f7-block class="copyright">
        Copyright © 2019 Tokyo.
    </f7-block>
  </f7-page>
</template>

<style lang="less">
.download-page {
  .logo {
    margin: 30px 0 0;
    text-align: center;
    > img {
      width: 75px;
      height: 75px;
      vertical-align: middle;
    }
  }
  .app-name {
    text-align: center;
    color: #666;
    font-size: 18px;
    margin-top: 6px;
  }
  .detail {
    text-align: center;
    color: #666;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 30px 10px 0;
    > p {
      margin: 6px 0;
      font-size:20px;
      color: #333;
    }
    .download1{
      border-style:none;
      max-width:70%;
      background-color:#0a94ed;
      border-radius: 5px;
      color: #FFF;
      font-size: 14px;
      margin: 6px 34px;
      padding: 10px 0;
    }
  }
  .copyright {
    left: 0;
    text-align: center;
    bottom: 0;
    font-size: 10px;
    color: #9c9c9c;
    width: 100%;
    padding: 0;
    margin: 20px 0;
  }
}
</style>

<script>
export default {
  methods: {
    viewKnowledge(id) {
      this.$f7router.navigate(`/knowledge/?mid=${id}&isowner=false&istry=true`)
    },
  }

}
</script>
