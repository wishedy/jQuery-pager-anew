/**
 * Created by ALLIN on 2017/6/14.
 */
;(function($){
    $.fn.pager = function(options){
        var pagerObject = {
            container:$(this),
            pageIndex:options.pagenumber-1,
            config: options,
            pagerData:[],
            methods: {
                init:function(){
                    var t = this;
                    t.generateData();
                    return t;
                },
                inputNumber:function(){
                    var t = this;
                    var pager = pagerObject;
                    var submitNum = function(num){
                        $(".pgJumpSubmit").off("mousedown").on("mousedown",function(){
                            if(num>0){
                                if(num>pagerObject.config.pagecount){
                                    num = pagerObject.config.pagecount;
                                }
                                pagerObject.pageIndex =num-1;
                                pager.config.buttonClickCallback && pager.config.buttonClickCallback(pagerObject.pageIndex+1);
                            }
                        });
                        $(".pgJumpNumber").off("keyup").on("keyup",function(e){
                            if(e.keyCode==13){
                                $(".pgJumpSubmit").trigger("mousedown");
                            }
                        });
                    };
                    $(".pgJumpNumber").off("input propertychange").on("input propertychange",function(){
                        var reg = /^\d{1,}$/;
                        if (reg.test($(this).val())) {
                            if($(this).val().length>0){
                                submitNum(parseInt($(this).val()));
                            }
                        } else {
                            $(this).val("");
                        }
                    })
                },
                changePage:function(){
                    var t = this;
                    $(".pgFirst").off("mousedown").on("mousedown",function(){
                        if(!$(this).hasClass("pgEmpty")){
                            pagerObject.pageIndex =0;
                            pager.config.buttonClickCallback && pager.config.buttonClickCallback(pagerObject.pageIndex+1);
                        }

                    });
                    $(".pgLast").off("mousedown").on("mousedown",function(){
                        if(!$(this).hasClass("pgEmpty")){
                            pagerObject.pageIndex =pagerObject.config.pagecount-1;
                            pager.config.buttonClickCallback && pager.config.buttonClickCallback(pagerObject.pageIndex+1);
                        }
                    });
                    $(".pgpre").off("mousedown").on("mousedown",function(){
                        if(!$(this).hasClass("pgEmpty")){
                            pagerObject.pageIndex--;
                            if(pagerObject.pageIndex<0){
                                pagerObject.pageIndex=0;
                            }
                            pager.config.buttonClickCallback && pager.config.buttonClickCallback(pagerObject.pageIndex+1);
                        }
                    });
                    $(".pgAfter").off("mousedown").on("mousedown",function(){
                        if(!$(this).hasClass("pgEmpty")){
                            pagerObject.pageIndex++;
                            if(pagerObject.pageIndex==pagerObject.config.pagecount){
                                pagerObject.pageIndex = pagerObject.config.pagecount-1;
                            }
                            pager.config.buttonClickCallback && pager.config.buttonClickCallback(pagerObject.pageIndex+1);
                        }
                    });

                },
                clickPager:function(){
                    var t = this;
                    var pager = pagerObject;
                    pager.container.find(".page-number").off("mousedown").on("mousedown",function(){
                        pager.pageIndex=parseInt($(this).text())-1;
                        pager.config.buttonClickCallback&&pager.config.buttonClickCallback(parseInt($(this).text()));
                  }) ;
                },
                templatePager:function(){
                    var pagerStr = "";
                    $.each(pagerObject.pagerData,function(i,v){
                        var currentClass="";
                        if(parseInt(v-1)==pagerObject.pageIndex){
                            currentClass = "pgCurrent";
                        }
                        var numberClass="page-number";
                        if(isNaN(parseInt(v))){
                            numberClass = "page-number-omit";
                        }
                        pagerStr+='<li class="'+numberClass+" "+currentClass+'">'+v+'</li>';
                    });
                    var firstPgClass="";
                    if(pagerObject.pageIndex==0){
                        firstPgClass = "pgEmpty";
                    }
                    var lastPgClass="";
                    if(pagerObject.pageIndex==pagerObject.config.pagecount-1){
                        lastPgClass = "pgEmpty";
                    }
                    var lastStr = '<ul class="pages"><li class="pgNext pgFirst '+firstPgClass+'">首页</li><li class="pgNext pgpre '+firstPgClass+'">上一页</li>'+pagerStr+'<li class="pgNext pgAfter '+lastPgClass+'">下一页</li><li class="pgNext  pgLast '+lastPgClass+'">末页</li></ul>';
                    if(pagerObject.config.pagecount>=14){
                        lastStr+='<div class="pgJump">'+
                            '    <span>跳转到</span>'+
                            '    <input type="text" class="pgJumpNumber">'+
                            '    <span>页</span>'+
                            '    <input type="button" value="确定" class="pgJumpSubmit">'+
                            '</div>';
                    }
                    return lastStr;
                },
                generateData:function(){
                    var pager = pagerObject;
                    pager.container.empty();
                    if(pager.config.pagecount>1){
                        var arrPager=[];
                        for(var i = 0;i<pager.config.pagecount;i++){
                            arrPager.push(i+1);
                        }
                        if(pager.config.pagecount>11){
                            if(pager.pageIndex<6){
                                var deleteLen = pager.config.pagecount-10;
                                arrPager.splice(9,deleteLen,"...");
                            }else{
                                var leftBetweenLen = pager.pageIndex-1;
                                var rightBetweenLen = pager.config.pagecount-pager.pageIndex-2;
                                if(leftBetweenLen>3&&rightBetweenLen>3){
                                    var deleteLeftLen = leftBetweenLen-3;
                                    arrPager.splice(1,deleteLeftLen,"...");
                                    var deleteRightLen = rightBetweenLen-3;
                                    arrPager.splice(pager.pageIndex+5-deleteLeftLen,deleteRightLen,"...");
                                }else{
                                    if(leftBetweenLen>3){
                                        var sdeleteLeftLen = pager.pageIndex+1-(11-(pager.config.pagecount-pager.pageIndex));
                                        arrPager.splice(1,sdeleteLeftLen,"...");
                                    }
                                    if(rightBetweenLen>3){
                                        var prolong = pager.config.pagecount-10;
                                        arrPager.splice(pager.pageIndex+prolong,prolong,"...");
                                    }
                                }
                            }
                        }
                        pager.pagerData = arrPager.join("$").split("$");
                        pager.container.html(this.templatePager());
                        this.clickPager();
                        this.inputNumber();
                        this.changePage();
                    }

                }

            }
        };
        pagerObject.methods.init();
    }
})(jQuery);