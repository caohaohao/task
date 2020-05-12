<template>
  <div>
    <vxe-toolbar export custom>
      <template v-slot:buttons>
        <vxe-button @click="$refs.xTree.setAllTreeExpansion(true)">展开所有</vxe-button>
        <vxe-button @click="$refs.xTree.clearTreeExpand()">关闭所有</vxe-button>
        <vxe-select id="selectIndex"
                    v-model="vSelectIndex"
                    placeholder="请选择"
                    prefix-icon="">
          <vxe-option v-for="num in selectIndex"
                      :key="num"
                      :value="num"
                      :label="`${num}` + '级'"></vxe-option>
        </vxe-select>
        <vxe-select id="taskSource"
                    :class="[{selectColor:flag}]"
                    v-model="taskSourceDefault"
                    placeholder="全部单位"
                    :options="taskSource"
                    clearable>
        </vxe-select>
        <vxe-select id="taskType"
                    v-model="taskValue"
                    :class="[{selectColor2:flag2}]"
                    placeholder="选择任务类型"
                    transfer
                    :option-groups="taskType"
                    clearable>
        </vxe-select>
        <!-- <vxe-button type="text" status="primary" @click.native = "clickBtnSearch(taskSourceDefault,taskType)" >搜索</vxe-button> -->
        <!-- <input v-model="filterName" type="type" placeholder="Filter" @keyup="searchEvent"> -->
        <vxe-input v-model="filterName"
                   placeholder="模糊搜索"
                   @click.native="reduceColor"
                   @keyup="searchEvent"></vxe-input>
        <vxe-button class="btn-search" type="text" status="primary" @click.native = "clickBtnSearch(taskSourceDefault,taskType)">搜索</vxe-button>
      </template>
    </vxe-toolbar>
    <vxe-table border
               resizable
               highlight-current-row
               export-config
               :height="windowHeight"
               ref="xTree"
               row-id="id"
               :tree-config="treeConfig"
               :data="tableData"
               :keyboard-config="keyboardConfig">
      <template v-for="(item, index) in tableColumn">
        <template v-if="item.field ==='tags'">
          <vxe-table-column :key="index"
                            :field="item.field"
                            :title="item.title"
                            :tree-node="index==0">
            <template v-slot="{ row }" >
              <template v-for="(tagObj,index) in row.tags">
                <vxe-button size="mini" v-if="tagObj.switch=== 'on'"
                            :key="index">{{tagObj.tag}}</vxe-button>
              </template>
            </template>
          </vxe-table-column>
        </template>
        <template v-else-if="item.field==='actions'">
          <vxe-table-column :key="index"
                            :field="item.field"
                            :title="item.title"
                            :tree-node="index==0">
              <template v-slot="{ row }" >
              <template v-for="(actionObj,index) in row.actions">
                <!--v-if="actionObj.method ==='tijiaoshenhe' vxe-primary-color"-->
                <vxe-button class="primary" :key="index" size="mini" icon="fa fa-star" v-if="actionObj.methods === 'guanzhu'">{{actionObj.title}}</vxe-button>
                <vxe-button class="primary" :key="index" size="mini" icon="" v-if="actionObj.methods === 'cuiban'">{{actionObj.title}}</vxe-button>
                <!-- <vxe-button :key="index" size="mini" icon="fa fa-save vxe-FFF-color" v-else-if="actionObj.method ==='jiaoban'">{{actionObj.title}}</vxe-button> -->
              </template>
            </template>
          </vxe-table-column>
        </template>
        <template v-else>
          <vxe-table-column :key="index"
                            :field="item.field"
                            :title="item.title"
                            :tree-node="index==0" :fixed="index===0?'left':''">
          </vxe-table-column>
        </template>
      </template>
    </vxe-table>
    <vxe-pager background
               :current-page.sync="currentPage"
               :page-size.sync="pageSize"
               :total="totalResult"
               @page-change="handlePageChange"
               :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'Total']">
    </vxe-pager>
  </div>
</template>
<script>
import XEUtils from 'xe-utils'
import axios from 'axios'
export default {
  data () {
    return {
      flag: false,
      flag2: false,
      windowHeight: `${document.documentElement.clientHeight - 160}`,
      filterName: '',
      loading: false,
      originData: [],
      // 任务类型
      taskValue: null,
      taskType: [],
      // 单位搜索参数 来源
      taskSourceDefault: null,
      taskSource: [],
      // 大纲参数
      selectIndex: 1,
      vSelectIndex: 1,
      newArrList: [],
      // 分页参数
      currentPage: 1,
      pageSize: 10,
      totalResult: 1,
      newIndex: 1,
      // 表格参数
      treeConfig: {
        children: 'children',
        iconOpen: 'fa fa-minus-square-o',
        iconClose: 'fa fa-plus-square-o',
        line: true,
        expandRowKeys: []
      },
      keyboardConfig: { isArrow: true, isEnter: true },
      // 表头数据
      tableColumn: [],
      tableData: [],
      serachMsg: ''
    }
  },
  created () {
  },
  mounted () {
    this.getData()
    this.handleSearch()
  },
  methods: {
    getNodeTrr (index) {

    },
    getData () {
      axios.get('/data/data3.json').then(res => {
        console.log(res)
        var data = res.data.children
        var tableColumnData = res.data.tableColumn
        var toolBar = res.data.toolBar
        // 共多少条数据
        this.totalResult = toolBar.totalResult
        // 大纲级别
        this.selectIndex = toolBar.maxZindex
        this.vSelectIndex = toolBar.maxZindex
        // 任务来源
        this.taskSource = toolBar.taskSource
        // 任务类型
        this.taskType = toolBar.taskType
        // 渲染表格需要一个数组
        this.tableData = data
        this.originData = XEUtils.clone(data, true)
        this.tableColumn = tableColumnData
        // 筛选层级需要数组的上一层结构是个children对象(跟据wideTraversal来定义的)
        this.newArrList = res.data
      })
    },
    handlePageChange ({ currentPage, pageSize }) {
      console.log(currentPage)
      console.log(this.newIndex)
      console.log(this.taskSourceDefault)
      console.log(this.taskValue)
      this.operationTree()
    },
    // 将多层数据结构转化为一个一维数组方法
    wideTraversal (node) {
      var nodes = []
      if (node != null) {
        var queue = []
        queue.unshift(node)
        while (queue.length !== 0) {
          var item = queue.shift()
          nodes.push(item)
          var children = item.children
          for (var i = 0; i < children.length; i++) {
            queue.push(children[i])
          }
        }
      }
      return nodes
    },
    handleSearch () {
      const filterName = XEUtils.toString(this.filterName).trim()
      if (filterName) {
        const options = { children: 'children' }
        const searchProps = ['name', 'type']
        this.tableData = XEUtils.searchTree(this.originData, item => searchProps.some(key => XEUtils.toString(item[key]).indexOf(filterName) > -1), options)
        // 搜索之后默认展开所有子节点
        console.log(this.tableData)
        this.$nextTick(() => {
          this.$refs.xTree.setAllTreeExpansion(true)
        })
      } else {
        this.tableData = this.originData
      }
    },
    clickBtnSearch (sureWord) {
      console.log(sureWord)
      //  = XEUtils.toString(this.filterName).trim()
      if (sureWord) {
        const options = { children: 'children' }
        const searchProps = ['name', 'type']
        this.tableData = XEUtils.searchTree(this.originData, item => searchProps.some(key => XEUtils.toString(item[key]).indexOf(sureWord) > -1), options)
        // 搜索之后默认展开所有子节点
        this.$nextTick(() => {
          this.$refs.xTree.setAllTreeExpansion(true)
        })
      } else {
        this.tableData = this.originData
      }
    },
    // 操纵树大纲级别函数
    operationTree () {
      // 先让树结构合起来
      this.$refs.xTree.clearTreeExpand()
      // 调用转一维数组的方法
      var newArrListMore = this.wideTraversal(this.newArrList)
      // 多了第一项删除(为什么这样不考虑)
      newArrListMore.shift()
      console.log(newArrListMore)
      var newArr = newArrListMore.map((item, index) => {
        if (item.outLineLevel <= this.newIndex) {
          return item
        }
      })
      var listArr = []
      newArr.map((item, index) => {
        if (item === undefined) {
        } else if (item.id.length <= this.newIndex) {
          listArr.push(item)
          return item
        }
      })
      // 使用框架函数展开所有级别id级别
      this.$refs.xTree.setTreeExpansion(listArr, true)
    },
    reduceColor () {
      this.flag = this.flag2 = false
    },
    // 创建一个防反跳策略函数，调用频率间隔 500 毫秒
    searchEvent: XEUtils.debounce(function () {
      this.handleSearch()
    }, 500, { leading: false, trailing: true })

  },
  watch: {
    // 监听select大纲层级的变化 调用大纲级别函数
    vSelectIndex: function (newIndex, oldIndex) {
      console.log(newIndex)
      this.newIndex = newIndex
      this.operationTree()
    },
    taskSourceDefault: function (newtaskSource, oldtaskSource) {
      this.taskSourceDefault = newtaskSource
      this.clickBtnSearch(newtaskSource)
      // this.flag = true
      // this.flag2 = false
    },
    taskValue: function (newtaskType, oldtaskType) {
      console.log(newtaskType)
      this.taskValue = newtaskType
      this.clickBtnSearch(newtaskType)
      // this.flag2 = true
      // this.flag = false
    }
  }
}
</script>

<style scoped>
.tree-node-icon {
  width: 24px;
  text-align: center;
}
.btn-search{
  background-color: #429cff;
  color: #FFF !important;
  padding: 5px 20px;
  font-size: 18px;
  border-radius: 5px;
}
div >>> .vxe-input .vxe-input--inner {
  /* border:1px solid #ddd; */
  text-align: center;
}
div >>> #selectIndex {
  margin: 0 12px;
  width: 120px;
  text-align: center;
}
.primary{
  background-color: #429cff;
  color:#FFF;
}
.primary:hover{
  color:#FFF !important;
}
.primary:active{
  color: #3196ff !important;
  border-color: #3196ff !important;
  background-color: #f7f7f7 !important
}
>>> .vxe-cell{
  display: flex;
  align-items: center;
}
.vxe-toolbar #taskType {
  width: 150px;
}
.vxe-toolbar >>> #taskSource {
  width: 150px;
}
.vxe-table >>> .vxe-body--row:nth-child(even) {
  background: #f7f7f7;
}
.vxe-table >>> .row--current:nth-child(even) {
  background: #e6f7ff;
}
.vxe-table >>> .row--current:nth-child(odd) {
  background: #e6f7ff;
}
.selectColor >>> div > input {
  background: red;
}
.selectColor2 >>> div > input {
  background: red;
}
.vxe-button--wrapper .vxe-input {
  margin-left: 10px;
}
#taskType {
  margin-left: 10px;
}
.vxe-optgroup >>> .vxe-optgroup--title {
  height: 0;
  line-height: 0px;
  padding: 5px 0;
}
.vxe-toolbar{
  padding:0 10px;
  background-color: rgba(28, 35, 117, 0.8);
}
</style>
