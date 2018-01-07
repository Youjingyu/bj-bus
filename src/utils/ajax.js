const baseUrl = 'http://www.bjbus.com/home/ajax_rtbus_data.php?';
const ajax = {
    get: function(data, json){
        return fetch(baseUrl + serialize(data))
                .then(res => {
                    return json ? res.json() : res.text();
                });
    }
}

function serialize(data){
    let result = [];
    for(let key in data){
        result.push(key + '=' + data[key]);
    }
    return result.join('&');
}

module.exports = ajax;