<template>
  <div>
    <vxe-toolbar export
                 custom>
      <template v-slot:buttons>
        <vxe-select id="taskSource" v-model="taskSourceDefault" placeholder="选择任务来源" :options="taskSource"></vxe-select>

        <vxe-select id="selectIndex"
                    v-model="selectIndex"
                    placeholder="请选择"
                    prefix-icon="">
          <vxe-option v-for="num in 6"
                      :key="num"
                      :value="num"
                      :label="`${num}` + '级'"></vxe-option>
        </vxe-select>
        <vxe-select id="taskType" v-model="value8" placeholder="选择任务类型" clearable transfer>
            <vxe-optgroup label="选项2">
              <vxe-option value="2-1" label="选项2-1"></vxe-option>
              <vxe-option value="2-2" label="选项2-2"></vxe-option>
              <vxe-option value="2-3" label="选项2-3"></vxe-option>
            </vxe-optgroup>
              <vxe-option value="3-1" label="选项3-1"></vxe-option>
              <vxe-option value="3-2" label="选项3-2"></vxe-option>
          </vxe-select>
       <vxe-button type="text" status="primary" @click.native = "clickBtnSearch('某')" >搜索</vxe-button>
        <!-- <input v-model="filterName" type="type" placeholder="Filter" @keyup="searchEvent"> -->
       <vxe-input v-model="filterName" placeholder="模糊搜索"  @keyup="searchEvent"></vxe-input>
        <vxe-button @click="$refs.xTree.setAllTreeExpansion(true)">展开所有</vxe-button>
        <vxe-button @click="$refs.xTree.clearTreeExpand()">关闭所有</vxe-button>
      </template>
    </vxe-toolbar>
    <vxe-table border
               resizable
               highlight-current-row
               export-config
               height="480"
               ref="xTree"
               row-id="id"
               :form-config="tableForm"
               :tree-config="treeConfig"
               :data="tableData"
               :keyboard-config="keyboardConfig">
    <vxe-table-column field="name" title="Name" tree-node>
    </vxe-table-column>
      <vxe-table-column field="size"
                        title="Size"></vxe-table-column>
      <vxe-table-column field="type"
                        title="Type"></vxe-table-column>
      <vxe-table-column field="date"
                        title="Date"></vxe-table-column>
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
      filterName: '',
      loading: false,
      originData: [],
      // 任务类型
      value8: null,
      // 单位搜索参数
      taskSourceDefault: null,
      taskSource: [
        { label: '选择任务来源', value: '3' },
        { label: '军委', value: '0' },
        { label: '连参', value: '1' },
        { label: '重点大队', value: '2' }

      ],
      // 大纲参数
      selectIndex: 2,
      newArrList: [],
      // 分页参数
      currentPage: 1,
      pageSize: 10,
      totalResult: 200,
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
      tableData: [],
      serachMsg: '',
      // toolbar参数
      tableForm: {
        items: [
          {
            field: 'name',
            title: '名称',
            itemRender: { name: 'input', attrs: { placeholder: '请输入名称' } }
          }
        ]
      }
    }
  },
  created () {
  },
  mounted () {
    this.getData()
    this.handleSearch()
  },
  methods: {
    getData () {
      axios.get('/data/data2.json').then(res => {
        var data = res.data.children
        // 渲染表格需要一个数组
        this.tableData = data
        this.originData = XEUtils.clone(data, true)
        console.log(data)
        // 筛选层级需要数组的上一层结构是个children对象(跟据wideTraversal来定义的)
        this.newArrList = res.data
      })
    },
    handlePageChange ({ currentPage, pageSize }) {
      console.log(currentPage)
      console.log(this.newIndex)
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
      //  = XEUtils.toString(this.filterName).trim()
      if (sureWord) {
        const options = { children: 'children' }
        const searchProps = ['name', 'type']
        this.tableData = XEUtils.searchTree(this.originData, item => searchProps.some(key => XEUtils.toString(item[key]).indexOf(sureWord) > -1), options)
        // 搜索之后默认展开所有子节点
        console.log(this.tableData)
        this.$nextTick(() => {
          this.$refs.xTree.setAllTreeExpansion(true)
        })
      } else {
        this.tableData = this.originData
      }
    },
    operationTree () {
      // 先让树结构合起来
      this.$refs.xTree.clearTreeExpand()
      // 调用转一维数组的方法
      var newArrListMore = this.wideTraversal(this.newArrList)
      // 多了第一项删除(为什么这样不考虑)
      newArrListMore.shift()
      console.log(newArrListMore)
      // var newArr = newArrListMore.map((item, index) => {
      //   var idLength = item.id.length
      //   if (idLength <= this.newIndex) {
      //     return item
      //   }
      // })
      var listArr = []
      // var newArr2 = newArr.map((item, index) => {
      //   if (item === undefined) {
      //   } else if (item.id.length <= this.newIndex) {
      //     listArr.push(item)
      //     return item
      //   }
      // })
      this.$refs.xTree.setTreeExpansion(listArr, true)
    },
    // 创建一个防反跳策略函数，调用频率间隔 500 毫秒
    searchEvent: XEUtils.debounce(function () {
      this.handleSearch()
    }, 500, { leading: false, trailing: true })

  },
  watch: {
    // 监听select大纲层级的变化
    selectIndex: function (newIndex, oldIndex) {
      console.log(newIndex)
      this.newIndex = newIndex
      this.operationTree()
    }
  }
}
</script>

<style scoped>
.tree-node-icon {
  width: 24px;
  text-align: center;
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
.vxe-toolbar #taskType{
  width:150px;
}
.vxe-toolbar >>> #taskSource{
  width:150px;
}
.vxe-table >>> .vxe-body--row:nth-child(even){
  background: #f7f7f7;
}
.vxe-table >>> .row--current:nth-child(even){
   background: #e6f7ff;
}
.vxe-table >>> .row--current:nth-child(odd){
   background: #e6f7ff;
}
</style>
