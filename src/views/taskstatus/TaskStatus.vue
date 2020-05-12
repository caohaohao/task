<template>
  <div class='task-status'>
    <div class="task-nav">
     <router-link to="/taskstatus/taskoverview">
       任务总览<i>99</i>
     </router-link>
     <router-link to="/taskstatus/execution">
       执行中 <i>99</i>
     </router-link>
     <router-link to="/taskstatus/accomplish">
       已完结 <i>99</i>
     </router-link>
     <router-link to="/taskstatus/overdue">
       逾期任务 <i>99</i>
     </router-link>
     <router-link to="/taskstatus/mytask">
       我的任务 <i>99</i>
     </router-link>
    </div>
     <!--悬浮的小球是一个新建按钮 从任务总览里新建任务  -->
     <div id="drag">
        <router-link id="buildIcon"  to="/buildtask/builddetail">11111</router-link>
        <span id="buildTask">新建任务</span>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { dragBuildBtn } from '@/assets/js/taskoverview'
export default {
  data () {
    return {

    }
  },
  methods: {

  },
  components: {},
  computed: {},
  created () {

  },
  mounted () {
    dragBuildBtn()
  }
}
</script>

<style lang="scss"  scoped>
  .task-nav {
    height:40px;
    line-height: 40px;
    >a{
    float:left;
    width:120px;
    display: inline-block;
    text-decoration: none;
    background-color: #132052;
    text-decoration: none;
    color: #FFF;
      position: relative;
      >i{
        width: 15px;
        height: 15px;
        line-height: 18px;
        padding: 3px;
        text-align: center;
        border-radius: 50%;
        background-color: #F00;
        font-size: 12px;
        position: absolute;
        top: 0px;
        right:5px;
      }
   }
    a:nth-child(1){
      border-radius: 8px 0 0 0;
    }
    a:last-child{
      border-radius: 0px 8px 0 0;
    }
    >.router-link-active{
    /*background: #21aeff;*/
    background: rgba(28, 35, 117, 0.8);
  }
  }
  #drag {
      position: absolute;
      /*设置绝对定位，脱离文档流，便于拖拽*/
      display: block;
      width: 250px;
      height: 30px;
      left: 40px;
      top: 100px;
      cursor: move;
      z-index: 4;
      /*鼠标呈拖拽状*/
    }
    #buildTask{
      display: none;
      float:left;
    }
    #buildIcon{
      float:left;
    }
</style>
