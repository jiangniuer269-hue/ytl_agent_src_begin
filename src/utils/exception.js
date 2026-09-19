export function outputError(source, error) {
  console.log(error.response ? error.response : error.message)
  if(error.data.code == 500){
    source.$message({
      showClose: true,
      message: error.data.msg,
      type: 'error'
    })
  }else{
    source.$message({
      showClose: true,
      message: error.data.msg || "授权错误",
      type: 'error'
    })
  }
}
