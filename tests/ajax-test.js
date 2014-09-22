define(function(require, exports, module){
    'use strict'
    var ajax, expect;

    ajax = require('ajax');
    expect = require('expect');

    function equals(){
        var args = arguments;
        expect(args[0]).to.equal(args[1]);
    }

    describe('Ajax', function(){
        describe('get', function(){
            it.only('normal', function(done){
                ajax.get('http://test.ajax.com:8080/get/test', function(res){
                    equals(res, 'success');
                    done();
                });
            });

            it('parameters', function(done){
                var test = $.mockjax({
                    url : '/get/test',
                    type : 'get',
                    status : 200,
                    response : function(result){
                        this.responseText = JSON.stringify(result.data);
                    }
                });

                ajax.get('/get/test', {a : 'b', c : 1}, function(res){
                    res = $.parseJSON(res);
                    equals(res.a, 'b');
                    equals(res.c, 1);
                    $.mockjaxClear(test);
                    done();
                });
            });

            it('successsive requests', function(done){
                var a = false, b = false;

                var test = $.mockjax({
                    url : '/get/test',
                    type : 'get',
                    status : 200,
                    responseTime : 500,
                    response : function(result){
                        this.responseText = JSON.stringify(result.data);
                    }
                });

                ajax.get('/get/test', {a : 'b', c : 1}, function(res){
                    res = $.parseJSON(res);
                    equals(res.a, 'b');
                    equals(res.c, 1);
                    a = true;
                });

                ajax.get('/get/test', {a : 'b', c : 1}, function(res){
                    res = $.parseJSON(res);
                    equals(res.a, 'b');
                    equals(res.c, 1);
                    b = true;
                });

                setTimeout(function(){
                    equals(a, true);
                    equals(b, false);
                    $.mockjaxClear(test);
                    done();
                }, 600);
            });

            it('cross domain', function(done){
                var test = $.mockjax({
                    url : 'http://test.com/get/test',
                    type : 'get',
                    status : 200,
                    response : function(result){
                        equals(result.dataType, 'jsonp');
                        this.responseText = JSON.stringify(result.data);
                    }
                });

                ajax.get('http://test.com/get/test', {a : 'b', c : 1}, function(res){
                    res = $.parseJSON(res);
                    equals(res.a, 'b');
                    equals(res.c, 1);
                    $.mockjaxClear(test);
                    done();
                });
            });

            it('500', function(done){
                var test = $.mockjax({
                    url : '/get/test',
                    type : 'get',
                    status : 500,
                    responseText : function(result){
                    }
                });

                ajax.get('/get/test', {a : 'b', c : 1}, function(){
                }).error(function(xhr){
                    equals(xhr.status, 500);
                    $.mockjaxClear(test);
                    done();
                });
            });

            it('404', function(done){
                var test = $.mockjax({
                    url : '/get/test',
                    type : 'get',
                    status : 404,
                    responseText : function(result){
                    }
                });

                ajax.get('/get/test', {a : 'b', c : 1}, function(){
                }).error(function(xhr){
                    equals(xhr.status, 404);
                    $.mockjaxClear(test);
                    done();
                });
            });

            it('timeout', function(done){
                var time = 6000;
                this.timeout(time);

                var test = $.mockjax({
                    url : '/get/test',
                    type : 'get',
                    status : 200,
                    responseTime : time,
                    responseText : function(result){
                    }
                });

                ajax.get('/get/test', {a : 'b', c : 1}, function(){
                }).error(function(xhr, errorMsg){
                    equals(errorMsg, 'timeout');
                    $.mockjaxClear(test);
                    done();
                });
            });
        });

        describe('getJSON', function(){
            it('normal', function(done){
                var test = $.mockjax({
                    url : '/getjson/test',
                    type : 'get',
                    status : 200,
                    responseText : {
                        status : 'success'
                    }
                });

                ajax.getJSON('/getjson/test', function(res){
                    equals(res.status, 'success');
                    $.mockjaxClear(test);
                    done();
                });
            });

            it('parameters', function(done){
                var test = $.mockjax({
                    url : '/getjson/test',
                    type : 'get',
                    status : 200,
                    response : function(result){
                        this.responseText = {
                            data : result.data
                        }
                    }
                });

                ajax.getJSON('/getjson/test', {a : 'b', c : 1}, function(res){
                    equals(res.data.a, 'b');
                    equals(res.data.c, 1);
                    $.mockjaxClear(test);
                    done();
                });
            });

            it('successsive requests', function(done){
                var a = false, b = false;

                var test = $.mockjax({
                    url : '/getjson/test',
                    type : 'get',
                    status : 200,
                    responseTime : 500,
                    response : function(result){
                        this.responseText = {
                            data : result.data
                        }
                    }
                });

                ajax.getJSON('/getjson/test', {a : 'b', c : 1}, function(res){
                    equals(res.data.a, 'b');
                    equals(res.data.c, 1);
                    a = true;
                });

                ajax.getJSON('/getjson/test', {a : 'b', c : 1}, function(res){
                    equals(res.data.a, 'b');
                    equals(res.data.c, 1);
                    b = true;
                });

                setTimeout(function(){
                    equals(a, true);
                    equals(b, false);
                    $.mockjaxClear(test);
                    done();
                }, 600);
            });

            it('cross domain', function(done){
                var test = $.mockjax({
                    url : 'http://test.com/getjson/test',
                    type : 'get',
                    status : 200,
                    response : function(result){
                        equals(result.dataType, 'jsonp');
                        this.responseText = {
                            data  : result.data
                        }
                    }
                });

                ajax.getJSON('http://test.com/getjson/test', {a : 'b', c : 1}, function(res){
                    equals(res.data.a, 'b');
                    equals(res.data.c, 1);
                    $.mockjaxClear(test);
                    done();
                });
            });

            it('500', function(done){
                var test = $.mockjax({
                    url : '/getjson/test',
                    type : 'get',
                    status : 500,
                    responseText : function(result){
                    }
                });

                ajax.getJSON('/getjson/test', {a : 'b', c : 1}, function(){
                }).error(function(xhr){
                    equals(xhr.status, 500);
                    $.mockjaxClear(test);
                    done();
                });
            });

            it('404', function(done){
                var test = $.mockjax({
                    url : '/getjson/test',
                    type : 'get',
                    status : 404,
                    responseText : function(result){
                    }
                });

                ajax.getJSON('/getjson/test', {a : 'b', c : 1}, function(){
                }).error(function(xhr){
                    equals(xhr.status, 404);
                    $.mockjaxClear(test);
                    done();
                });
            });

            it('timeout', function(done){
                var time = 6000;
                this.timeout(time);

                var test = $.mockjax({
                    url : '/getjson/test',
                    type : 'get',
                    status : 200,
                    responseTime : time,
                    responseText : function(result){
                    }
                });

                ajax.getJSON('/getjson/test', {a : 'b', c : 1}, function(){
                }).error(function(xhr, errorMsg){
                    equals(errorMsg, 'timeout');
                    $.mockjaxClear(test);
                    done();
                });
            });
        });

        describe('getScript', function(){
            it('normal', function(done){
                var text = '(function(){})();';

                var test = $.mockjax({
                    url : '/getscript/test',
                    type : 'get',
                    status : 200,
                    responseText : text
                });

                ajax.getScript('/getscript/test', function(res){
                    equals(text, res);
                    $.mockjaxClear(test);
                    done();
                });
            });

            it('successsive requests', function(done){
                var a = false, b = false;
                var text = '(function(){})();';

                var test = $.mockjax({
                    url : '/getscript/test',
                    type : 'get',
                    status : 200,
                    responseTime : 500,
                    responseText : text
                });

                ajax.getScript('/getscript/test', function(res){
                    equals(text, res);
                    a = true;
                });

                ajax.getScript('/getscript/test', function(res){
                    equals(text, res);
                    b = true;
                });

                setTimeout(function(){
                    equals(a, true);
                    equals(b, false);
                    $.mockjaxClear(test);
                    done();
                }, 600);
            });

            it('cross domain', function(done){
                this.timeout(5000);
                ajax.getScript('http://cdn.staticfile.org/underscore.js/1.6.0/underscore-min.js', function(res){
                    equals(_.VERSION, '1.6.0');
                    done();
                });
            });

            it('500', function(done){
                var test = $.mockjax({
                    url : '/getscript/test',
                    type : 'get',
                    status : 500
                });

                ajax.getScript('/getscript/test', function(){
                }).error(function(xhr){
                    equals(xhr.status, 500);
                    $.mockjaxClear(test);
                    done();
                });
            });

            it('404', function(done){
                var test = $.mockjax({
                    url : '/getscript/test',
                    type : 'get',
                    status : 404
                });

                ajax.getScript('/getscript/test', function(){
                }).error(function(xhr){
                    equals(xhr.status, 404);
                    $.mockjaxClear(test);
                    done();
                });
            });

            it('timeout', function(done){
                var time = 6000;
                this.timeout(time);

                var test = $.mockjax({
                    url : '/getscript/test',
                    type : 'get',
                    status : 200,
                    responseTime : time
                });

                ajax.getJSON('/getscript/test', function(){
                }).error(function(xhr, errorMsg){
                    equals(errorMsg, 'timeout');
                    $.mockjaxClear(test);
                    done();
                });
            });
        });

        describe('post', function(){
            it('normal', function(done){
                var test = $.mockjax({
                    url : '/post/test',
                    type : 'post',
                    status : 200,
                    responseText : 'success'
                });

                ajax.post('/post/test', function(res){
                    equals(res, 'success');
                    $.mockjaxClear(test);
                    done();
                });
            });

            it('parameters', function(done){
                var test = $.mockjax({
                    url : '/post/test',
                    type : 'post',
                    status : 200,
                    response : function(result){
                        this.responseText = JSON.stringify(result.data);
                    }
                });

                ajax.post('/post/test', {a : 'b', c : 1}, function(res){
                    res = $.parseJSON(res);
                    equals(res.a, 'b');
                    equals(res.c, 1);
                    $.mockjaxClear(test);
                    done();
                });
            });

            it('successsive requests', function(done){
                var a = false, b = false;

                var test = $.mockjax({
                    url : '/post/test',
                    type : 'post',
                    status : 200,
                    responseTime : 500,
                    response : function(result){
                        this.responseText = JSON.stringify(result.data);
                    }
                });

                ajax.post('/post/test', {a : 'b', c : 1}, function(res){
                    res = $.parseJSON(res);
                    equals(res.a, 'b');
                    equals(res.c, 1);
                    a = true;
                });

                ajax.post('/post/test', {a : 'b', c : 1}, function(res){
                    res = $.parseJSON(res);
                    equals(res.a, 'b');
                    equals(res.c, 1);
                    b = true;
                });

                setTimeout(function(){
                    equals(a, true);
                    equals(b, false);
                    $.mockjaxClear(test);
                    done();
                }, 600);
            });

            it('cross domain: parameters is object', function(done){
                ajax.post('http://test2.ajax.com:8080', {a: 'b', c : 1}, function(res){
                    equals(res.status, 'ok');
                    done();
                });
            });

            it('cross domain: parameters is string', function(done){
                var form = $('#form');

                ajax.post(form.attr('action'), form.serialize(), function(res){
                    equals(res.status, 'ok');
                    done();
                });
            });

            it('cross domain: serial request', function(done){
                this.timeout(2000);

                var a = false, b = false;

                ajax.post('http://test2.ajax.com:8089', {a : 'b', c : 1}, function(res){
                    b = true;
                });

                ajax.post('http://test2.ajax.com:8080', {a: 'b', c : 1}, function(res){
                    a = true;
                });

                setTimeout(function(){
                    equals(a, true);
                    equals(b, true);
                    done();
                }, 1500);
            });

            it('cross domain: successsive requests', function(done){
                this.timeout(2000);

                var a = false, b = false;

                ajax.post('http://test2.ajax.com:8089', {a : 'b', c : 1}, function(res){
                    a = true;
                });

                ajax.post('http://test2.ajax.com:8089', {a : 'b', c : 1}, function(res){
                    b = true;
                });

                setTimeout(function(){
                    equals(a, true);
                    equals(b, false);
                    done();
                }, 1500);
            });

            it('cross domain: timeout', function(done){
                this.timeout(7000);

                var a = false;

                ajax.post('http://test2.ajax.com:8088', {a: 'b', c : 1}, function(res){
                    a = true;
                });

                setTimeout(function(){
                    equals(a, false);
                    done();
                }, 6000);
            });

            it('500', function(done){
                var test = $.mockjax({
                    url : '/post/test',
                    type : 'post',
                    status : 500
                });

                ajax.post('/post/test', {a : 'b', c : 1}, function(){
                }).error(function(xhr){
                    equals(xhr.status, 500);
                    $.mockjaxClear(test);
                    done();
                });
            });

            it('404', function(done){
                var test = $.mockjax({
                    url : '/post/test',
                    type : 'post',
                    status : 404
                });

                ajax.post('/post/test', {a : 'b', c : 1}, function(){
                }).error(function(xhr){
                    equals(xhr.status, 404);
                    $.mockjaxClear(test);
                    done();
                });
            });

            it('timeout', function(done){
                var time = 6000;
                this.timeout(time);

                var test = $.mockjax({
                    url : '/post/test',
                    type : 'post',
                    status : 200,
                    responseTime : time
                });

                ajax.post('/post/test', function(){
                }).error(function(xhr, errorMsg){
                    equals(errorMsg, 'timeout');
                    $.mockjaxClear(test);
                    done();
                });
            });
        });

        describe('ajax', function(){
            it('normal get', function(done){
                var test = $.mockjax({
                    url : '/get/test',
                    type : 'get',
                    status : 200,
                    responseText : 'success'
                });

                ajax.ajax({
                    url : '/get/test',
                    type : 'get',
                    success : function(res){
                        equals(res, 'success');
                        $.mockjaxClear(test);
                        done();
                    }
                });
            });

            it('normal getJSON', function(done){
                var test = $.mockjax({
                    url : '/getjson/test',
                    type : 'get',
                    status : 200,
                    responseText : {
                        status : 'success'
                    }
                });

                ajax.ajax({
                    url : '/getjson/test',
                    type : 'get',
                    dataType : 'json',
                    success : function(res){
                        equals(res.status, 'success');
                        $.mockjaxClear(test);
                        done();
                    }
                });
            });

            it('normal getScript', function(done){
                var text = '(function(){})();';

                var test = $.mockjax({
                    url : '/getscript/test',
                    type : 'get',
                    status : 200,
                    responseText : text
                });

                ajax.ajax({
                    url : '/getscript/test',
                    type : 'get',
                    dataType : 'script',
                    success : function(res){
                        equals(text, res);
                        $.mockjaxClear(test);
                        done();
                    }
                });
            });

            it('normal post', function(done){
                var test = $.mockjax({
                    url : '/post/test',
                    type : 'post',
                    status : 200,
                    responseText : 'success'
                });

                ajax.ajax({
                    url : '/post/test',
                    type : 'post',
                    success : function(res){
                        equals(res, 'success');
                        $.mockjaxClear(test);
                        done();
                    }
                });
            });

            it('cross domain: get', function(done){
                var test = $.mockjax({
                    url : 'http://test.com/get/test',
                    type : 'get',
                    status : 200,
                    response : function(result){
                        equals(result.dataType, 'jsonp');
                        this.responseText = JSON.stringify(result.data);
                    }
                });

                ajax.ajax({
                    url : 'http://test.com/get/test',
                    data : {a : 'b', c : 1},
                    type : 'get',
                    success : function(res){
                        res = $.parseJSON(res);
                        equals(res.a, 'b');
                        equals(res.c, 1);
                        $.mockjaxClear(test);
                        done();
                    }
                });
            });

            it('cross domain: getJSON', function(done){
                var test = $.mockjax({
                    url : 'http://test.com/getjson/test',
                    type : 'get',
                    status : 200,
                    response : function(result){
                        equals(result.dataType, 'jsonp');
                        this.responseText = {
                            data  : result.data
                        }
                    }
                });

                ajax.ajax({
                    url : 'http://test.com/getjson/test',
                    data : {a : 'b', c : 1},
                    type : 'get',
                    dataType : 'json',
                    success : function(res){
                        equals(res.data.a, 'b');
                        equals(res.data.c, 1);
                        $.mockjaxClear(test);
                        done();
                    }
                });
            });

            it('cross domain: getScript', function(done){
                this.timeout(5000);

                ajax.ajax({
                    url : 'http://cdn.staticfile.org/underscore.js/1.6.0/underscore-min.js',
                    type : 'get',
                    dataType : 'script',
                    success : function(res){
                        equals(_.VERSION, '1.6.0');
                        done();
                    }
                });
            });

            it('cross domain: post', function(done){
                ajax.ajax({
                    url : 'http://test2.ajax.com:8080',
                    type : 'post',
                    data : {a: 'b', c : 1},
                    success : function(res){
                        equals(res.status, 'ok');
                        done();
                    }
                });
            });

            it('timeout: get', function(done){
                var time = 6000;
                this.timeout(time);

                var test = $.mockjax({
                    url : '/get/test',
                    type : 'get',
                    status : 200,
                    responseTime : time,
                    responseText : function(result){
                    }
                });

                ajax.ajax({
                    url : '/get/test',
                    type : 'get',
                    data : {a : 'b', c : 1},
                    success : function(){},
                    error : function(xhr, errorMsg){
                        equals(errorMsg, 'timeout');
                        $.mockjaxClear(test);
                        done();
                    }
                });
            });

            it('timeout: post', function(done){
                this.timeout(7000);

                ajax.ajax({
                    url : 'http://test2.ajax.com:8088',
                    type : 'post',
                    data : {a : 'b', c : 1},
                    success : function(){},
                    error : function(errorMsg){
                        equals(errorMsg, 'timeout');
                        done();
                    }
                });
            });
        });
    });
});