    x.getFileSize=function(str, _type){
        var str = str.trim().toLowerCase()
        str = str.replace("bytes","b")

        var match = "^"+x.fileSizeRx+"$"
        if(!str.match(match)) return false

        var num = str.match(/^[0-9]{1,}[.]{0,1}[0-9]{0,}/)[0]
        num = Number.parseFloat(num)

        var type = str.match(/[kmg]{0,1}[i]{0,1}[b]$/)[0].replace("i","")

        var types ={
            b: 1,
            kb: Math.pow(10,3),
            mb: Math.pow(10,6),
            gb: Math.pow(10,9),
        }

        if(!_type) return num*types[type]

        return (num*types[type])/types[_type.toLowerCase()]
    }
