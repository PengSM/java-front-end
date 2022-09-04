const fs = require('fs')

fs.writeFile('doc0.doc','hello',(error)=>{
    if (error){
        console.log('创建失败:${error}')
    }
    console.log('创建成功')
})

var n = 5
for (let i=0;i<n;i++){
    fs.writeFile('doc/i.txt',(error)=>{
        if (error){
            console.log('创建txt失败:${error}')
        }
        console.log('创建txt成功')
    })
}