/**
 * 通用的全局http请求处理文件
 */

import axios from '@/utils/XMLHttpRequest'
import { notify } from '@/utils/XMLHttpRequest'
import {
  Notification
} from 'element-ui'

const http = {
  changeStatus: function(url, data, show = false){
    return axios.post(url, data, show).then(res => {
      if (res.code == 200) {
        notify("success", "修改状态成功");
      }
    }).catch(err => {
      notify("error", "修改错误");
    });
  }
}

export default http