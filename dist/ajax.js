define(function(require, exports, module){
    'use strict'
    var o, cache;
    
    cache = [];
    
    o = {
        ajax : function(url, opt){
            if(typeof url === 'object'){
                opt = url;
                url = undefined;
            }
    
            opt || (opt = {});
            opt.timeout || (opt.timeout = 5000);
            typeof url === 'string' && (opt.url = url);
            opt.type = (opt.type || 'get').toLowerCase();
    
            return launchRequest(opt);
        },
        getJSON : function(url, data, callback){
            return this.get(url, data, callback, 'json');
        },
        getScript : function(url, callback){
            return this.get(url, void 0, callback, 'script');
        }
    };
    
    $.each(['get', 'post'], function(index, methodName){
        o[methodName] = function(url, data, callback, type){
            if($.isFunction(data)){
                type = type || callback;
                callback = data;
                data = undefined;
            }
    
            return o.ajax({
                url : url,
                data : data,
                dataType : type,
                success : callback,
                type : methodName
            });
        };
    });
    
    function launchRequest(opt){
        preventRepeatSubmit(opt);
    
        if(isCrossDomain(opt.url)){
            if(opt.type == 'get' && (!opt.dataType || indexOf(['json', 'jsonp'], opt.dataType) != -1)){
                opt.dataType = 'jsonp';
            }
    
            if(opt.type == 'post'){
                crossDomainPost(opt);
                return null;
            }
        }
    
        return $.ajax(opt);
    };
    
    function isCrossDomain(url){
        var a = document.createElement('a');
        a.href = url;
    
        return a.origin != location.origin;
    };
    
    function preventRepeatSubmit(opt){
        var beforeSend, complete;
    
        complete = opt.complete;
        beforeSend = opt.beforeSend;
    
        opt.beforeSend = function(){
            var uid = uniqueCid(opt);
    
            beforeSend && beforeSend.apply(opt, arguments);
    
            if(indexOf(cache, uid) == -1){
                cache.push(uid);
            }else{
                return false;
            }
        };
    
        opt.complete = function(){
            var index = indexOf(cache, uniqueCid(opt));
    
            if(index !== -1){
                cache.splice(index, 1);
            }
    
            complete && complete.apply(opt, arguments);
        };
    };
    
    function crossDomainPost(opt){
        var iframe, form, complete;
    
        complete = opt.complete;
    
        if(opt.beforeSend() == false){
            return;
        }
    
        iframe = createIframe(opt);
        form = createForm(opt, iframe.attr('id'));
    
        opt.complete = function(){
            iframe.remove();
            form.remove();
    
            complete && complete.apply(opt, arguments);
        };
    
        form.submit();
    
        setTimeout(function(){
            iframe.trigger('load', 'timeout');
        }, opt.timeout);
    };
    
    function createIframe(opt){
        var iframe, iframeId;
    
        iframeId = 'crosspost' + (+new Date());
    
        iframe = $('<iframe name='+ iframeId +'/>').attr({
            id : iframeId,
            src : 'about:blank'
        }).css('display', 'none').appendTo(document.body);
    
        return iframe.one('load', function(e, msg){
            var text, body;
    
            body = iframe[0].contentWindow.document.body;
            text = body.innerText || body.innerHTML;
    
            if(text){
                opt.success && opt.success.call(null, $.parseJSON(text));
            }else{
                opt.error && opt.error.call(null, msg || 'server is not return results');
            }
    
            opt.complete.call(null);
        });
    };
    
    function createForm(opt, iframeId){
        var form, inputs, data, key, val, idx, len;
    
        data = opt.data;
        inputs = ['<input type="hidden" name="cross_post", value="1" />'];
    
        form = $('<form />').attr({
            action : opt.url,
            method : 'post',
            target : iframeId
        }).appendTo(document.body);
    
        if(data){
            if(typeof data === 'string'){
                data = unserialize(data);
            }
    
            for(key in data){
                if(data.hasOwnProperty(key)){
                    if(isArray(val = data[key])){
                        for(idx = 0, len = val.length; idx < len; idx++){
                            inputs.push('<input type="hidden" name="' + key + '" value="'+ val[idx] + '"/>');
                        }
                    }else{
                        inputs.push('<input type="hidden" name="' + key + '" value="'+ val + '"/>');
                    }
                }
            }
        }
    
        return form.html(inputs.join(''));
    };
    
    function uniqueCid(opt){
        var uid;
    
        if(opt.data){
            if(typeof opt.data === 'string'){
                uid = opt.url + opt.data;
            }else{
                uid = opt.url + $.param(opt.data);
            }
        }else{
            uid = opt.url;
        }
    
        return uid;
    }
    
    function indexOf(array, item){
        var index, length;
    
        index = 0;
        length = array.length;
    
        if(array != null){
            for(; index < length; index++){
                if(array[index] === item){
                    return index;
                }
            }
        }
    
        return -1;
    };
    
    function unserialize(str){
        var items, result, index, len, parts, old, key, val;
    
        index = 0;
        result = {};
        items = str.split('&');
    
        for(len = items.length; index < len; index++){
            parts = items[index].split('=');
            key = parts[0];
            val = parts[1];
    
            if(old = result[key]){
                if(isArray(old)){
                    old.push(decode(val));
                }else{
                    result[key] = [old, decode(val)];
                }
            }else{
                result[key] = decode(val);
            }
        }
    
        return result;
    };
    
    function decode(str){
        return decodeURIComponent(str.replace(/\+/g," "));
    };
    
    function isArray(val){
        return Object.prototype.toString.call(val) === '[object Array]';
    }
    
    module.exports = o;
});
