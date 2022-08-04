/**
 * @desc 手写promisify
 */

//promisify用于改造nodejs现有的异步api, 返回promis对象
// 从而支持异步函数语法 async await)
// 基本用法
const fs = require('fs')
const util = require('util')
// 将fs.readFile转换为一个接收相同参数的，但返回 Promise 的函数
const promisifyDemo = async () => {
  const readFile = util.promisify(fs.readFile)
  // res 是 异步读取文件之后，callcack的返回值
  try {
    const res = await readFile('filename')
    console.log('res===',res)
  } catch (error) {
    console.log('error==',error)
  }
}
// promisifyDemo()

// 总结， 对于带回调函数的异步函数promisify，接受的参数不变，只是不需要在传入cb（拿到res并处理逻辑），而是在promisify里拿到res后通过resolve返回，然后在写逻辑
//  相当于在调用异步函数时，正常传入参数和回调的写法，是把拿到res和处理逻辑都在回调函数里做了，而promisify是在内部调用异步函数，拿到res后通过resolve返回但不处理逻辑，然后在外面await拿到后在写处理res的逻辑
function promisify(fn){
  return function () {
    return new Promise((resolve,reject) => {
      // 异步函数fn的callback回调函数在promise内部执行，代替cb通过resolve返回结果，所以说promisify是promise和callback的桥梁
      const args = Array.prototype.slice.call(arguments)
      fn.call(this, ...args, (err, res)=>{
        if(!err){
          // 本来是这这里写逻辑的，但是这里resolve出去，就可以以同步的方式写处理res的逻辑了
          // 通过resolve返回异步操作后拿到的res
          resolve(res)
        }else{
          reject(err)
        }
      })
    })
  }
}

const asyncFn = function(name,cb){
  setTimeout(()=>{
    if(Math.random()*10 > 5){
      cb('', name)
    }else{
      cb('error')
    }
  }, 1000)
}
// 正常调用异步函数
asyncFn('tommy', (err,res)=>{
  if(!err){
    // 处理异步操作成功的res
  }else{
    // 处理异步操作报错
  }
})

const testPromisify = async () => {
  const promisifiedFn = promisify(asyncFn)
  try {
    const res = await promisifiedFn('wsz')
    console.log('res===',res)
  } catch (error) {
    console.log('error==',error)
  }
}

testPromisify()
