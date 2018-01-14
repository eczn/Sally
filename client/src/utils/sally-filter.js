// sally-filter.js

export default {
    install(Vue){
        Vue.filter('sallyTime', function(date_str){
            let d = new Date(date_str); 
        
            let L = [
                d.getFullYear()
            ].concat(
                [
                    d.getMonth(),
                    d.getDate()
                ].map(e => ('00' + e).slice(-2))
            ).join('-')
        
            let R = [
                d.getHours(),
                d.getMinutes()
            ].map(e => ('00' + e).slice(-2)).join(':'); 
        
            return L + ' ' + R;
        })

        Vue.filter('sallyDate', function(date_str){
            let d = new Date(date_str); 
        
            return [
                d.getFullYear()
            ].concat(
                [
                    d.getMonth(),
                    d.getDate()
                ].map(e => ('00' + e).slice(-2))
            ).join('-')
        
            
        })
    }
}