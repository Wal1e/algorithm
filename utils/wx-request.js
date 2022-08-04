// wxRequest({
//   url: 'example.php', //仅为示例，并非真实的接口地址
//   data: {
//     x: '',
//     y: ''
//   },
//   header: {
//     'content-type': 'application/json' // 默认值
//   },
//   success (res) {
//     console.log('suc-res=',res)
//   },
//   fail (err) {
//     console.log('fail-err=',err)
//   },
//   complete (res) {
//     console.log('complete-res=',res)
//   }
// })

// 内部实现
function wxRequest(param){
  const { url, success, fail, complete } = param
  setTimeout(()=>{
    if(Math.random()*10 >= 5){
      success('suc')
    }else{
      fail('fail')
    }
    complete(url)
  },1000)
}

// 总结， 对于带回调函数的异步函数promisify，接受的参数不变，只是不需要在传入cb（拿到res并处理逻辑），而是在promisify里拿到res后通过resolve返回，然后在写逻辑
//  相当于在调用异步函数时，正常传入参数和回调的写法，是把拿到res和处理逻辑都在回调函数里做了，而promisify是在内部调用异步函数，拿到res后通过resolve返回但不处理逻辑，然后在外面await拿到后在写处理res的逻辑

// 如果在success的回调里在发送request，就会回调地狱，可对wxRequest promise化

function promisifyWxRequest(fn){
  return function(){
    const args = Array.prototype.slice.call(arguments)
    let completeRes = ''
    let suceessRes = ''
    let errorRes = ''
    return new Promise((resolve, reject) => {
      const param = args[0]
      fn({
        ...param,
        success(res){
          suceessRes = res;
        },
        fail(err){
          errorRes = err;
        },
        complete(res){
          if(suceessRes) resolve({res:suceessRes, completeRes: res});
          if(errorRes) resolve({err:errorRes, completeRes: res});
        }
      })
    })
  }
}

async function testPromisifyWxRequest(){
  const wxRequestDemo = promisifyWxRequest(wxRequest)
  try {
    const res = await wxRequestDemo({
      url: 'test'
    })
    console.log('res==',res)
  } catch (error) {
    console.log('error==',error)
  }
}
testPromisifyWxRequest()
