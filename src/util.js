let getUrlKey=(name)=> {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
}


let formatDate=(date, fmt)=>{
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
}

let formatJsonDateStr=(str)=>{
    var date = new Date(str).toISOString().replace(/T/g, ' ').replace(/.[\d]{3}Z/, ' ')
    return date
}

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}

export default{
    getUrlKey:getUrlKey,
    formatDate:formatDate,
    formatJsonDateStr:formatJsonDateStr
}