<template>
  <f7-page class="knowledge-view">
    <f7-navbar :title="$t('app.knowledge')" :back-link="$t('app.back')"></f7-navbar>
    <f7-block>
        <div class="logo">
            <img src="@/assets/images/hiapp_logo@2x.png" alt="logo">
        </div>
        <div class="app-name">wohApp</div>
    </f7-block>
    <f7-block class="detail">
        <p>GitHub: highwayns/wohApp</p>
        <p>Email: tei952@gmail.com</p>
        <p>Twitter: @tei952</p>
    </f7-block>
    <f7-block class="copyright">
        Copyright © 2019 Tokyo.
    </f7-block>
  </f7-page>
</template>

<style lang="less">
  .knowledge-view {
    .logo {
    width: 90px;
    height: 90px;
    line-height: 90px;
    background-color: #fff;
    text-indent: -9999;
    border-radius: 5px;
    margin: 0 auto;
    border: 1px solid #dfdfdf;
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
    font-size: 20px;
    margin-top: 15px;
  }
  .detail {
    text-align: center;
    color: #666;
    > p {
      margin: 6px 0;
    }
  }
  .copyright {
    position: absolute;
    left: 0;
    text-align: center;
    bottom: 0;
    font-size: 10px;
    color: #9c9c9c;
    width: 100%;
    padding: 0;
  }
}
</style>

<script>
export default {}
</script>
