require('../style/common.styl');
require('../style/main_style.styl');
const $ = require('zepto');
const doT = require('doT');
const throttle = require('lodash2/throttle');
const Cookie = require('js-cookie');
const Swiper = require('swiperjs');
const mCommon = require('com.cmcm.cloud');
const mSimpleUi = require('../../../../../node_modules/com.cmcm.cloud/src/ui/simpleUi.js');
const mRequest = require('../../../../../node_modules/com.cmcm.cloud/src/mall/request.js');
const helper = require('../../../../../node_modules/com.cmcm.cloud/src/mall/treasure_helper.js');
const mMyCredits = require('./modules/my_credits.js');
const notifyAnim = require('./modules/anim.js');
const mStorage = require('../../../../../node_modules/com.cmcm.cloud/src/storage.js');
const mScreenPromotion = require('./modules/screen_promotion.js');
const mActivityGetReward = require('./modules/activity_get_reward.js');
const mReporter = require('../../../../../node_modules/com.cmcm.cloud/src/mall/report_treasure.js');
window.onerror = function(messageOrEvent, source, lineno, colno, error){
    console.log(messageOrEvent, source, lineno, colno, error)
}
const mData = {
    firstRequestSuccess: false,
    broadcast: [],
    broadInterval: [],
    tpl_pur: '<img src="%0$s" onerror="this.src=\'/common/imgs/default-avatar.png\';this.onerror=null;">@@i18n.main_notify_purchase',
    tpl_win: '<img src="%0$s" onerror="this.src=\'/common/imgs/default-avatar.png\';this.onerror=null;">@@i18n.main_notify_got',
    isRequestingList: false,
    has_more: true,
    next_offset: '',
    isRequestingActivityReward: false,
    user_profile: {}
};

const mElement = {
    treasureList: $('.treasure-list')
};
const isLogined = Cookie.get('wsc_sid');


error()

// 已选择的国家
const localRegion = JSON.parse(mStorage.local.getItem('select_region_result_data'));
const sessionRegion = JSON.parse(mStorage.session.getItem('select_region_result_data'));
if(localRegion) localRegion.text_locale = localRegion.text_locale || localRegion.text;
if(sessionRegion) sessionRegion.text_locale = sessionRegion.text_locale || sessionRegion.text;

// 中东国家 沙特、阿联酋、科威特
// 选择了中东国家 将会返回为沙特 （国家码沙特SA就代表中东）
if(localRegion && helper.isMiddleEast(localRegion.code)) {
    localRegion.code = 'SA'
    localRegion.text_locale = 'ME'
}
if(sessionRegion && helper.isMiddleEast(sessionRegion.code)){
    sessionRegion.code = 'SA'
    sessionRegion.text_locale = 'ME'
    sessionRegion.text_locale_origin = 'Middle East'
}


;(function(){
    const Main = {
        init(){
            if(isLogined){
                this.requestUserInfo();
                this.initScreenPromotion();
            }else {
                // 未登录 保留选择的国家 不做处理
                if(localRegion) {
                    $('#sel-country').html(localRegion.text_locale)
                    this.swiper(localRegion.code)
                    this.getDailyRank(localRegion.code)
                }else {
                    this.swiper()
                    this.getDailyRank()
                }
            }
            this.events()
            this.requestList()
            this.getBroadcastInfo()
            setInterval(() => { this.getBroadcastInfo() }, 50000)
        },
        requestUserInfo() {
            mRequest.getUserProfile({}, data => {
                // 用户已经登录 判断选择的国家和自己的收货国家
                mData.user_profile = data.profile;
                if(!data.profile.country){
                    // 选择收货地区
                    $('.modal-wrapper').removeClass('hide')
                    $('.shipping-region').removeClass('hide')
                }else {
                    // 判断用户是否为中东
                    let userCountry = data.profile.country
                    if(helper.isMiddleEast(data.profile.country)){
                        userCountry = 'SA'
                    }
                    if(sessionRegion && data.profile.country != '' && sessionRegion.code != userCountry){
                        // 不匹配
                        $('.not-match-region .selected-region').html(sessionRegion.text_locale_origin || sessionRegion.text_locale)
                        $('.not-match-region .my-shipping-region').html(data.profile.country)
                        $('.modal-wrapper').removeClass('hide')
                        $('.not-match-region').removeClass('hide')
                    }
                    if(localRegion){
                        $('#sel-country').html(localRegion.text_locale)
                    }
                    if(sessionRegion){
                        $('#sel-country').html(sessionRegion.text_locale)
                    }
                }

                mMyCredits.init(data.user_balance || 0);
                const country = sessionRegion && sessionRegion.code || localRegion && localRegion.code || data.profile.country
                this.swiper(country);
                this.getDailyRank(country)
                this.initActivityGetReward();
            }, errData => {
                this.handleError(errData.error);
            });
        },
        swiper(country = ''){
            this._requestBanner(country, data => {
                let tpl = $('#banner_list').html(),
                    compile = doT.template(tpl),
                    html = compile(data.banner);
                $('.swiper-container').html(html);
                const swiperOpt = {
                    loop: true,
                    preloadImages: true,
                    lazyLoading: true,
                    pagination: '.swiper-pagination'
                }
                if(data.autoplay){
                    swiperOpt.autoplay = 5000
                    swiperOpt.speed = 500
                }
                new Swiper ('.swiper-container', swiperOpt)
            })
        },
        _requestBanner(country = '', fn){
            mRequest.getBanner({country: country}, d => {
                fn && fn(d)
            })
        },
        getBroadcastInfo(){
            let country = ''
            if(localRegion && localRegion.code){
                country = localRegion.code
            }
            if(sessionRegion && sessionRegion.code){
                country = sessionRegion.code
                mStorage.session.removeItem('select_region_result_data')
            }
            mRequest.getBroadcast({country: country}, function(data, timestamp) {
                mData.broadcast = data.broadcast;
                const loopBroadcast = () => {
                    if(mData.broadcast.length) {
                        let tpl = mData.tpl_win;
                        if(mData.broadcast[0].type == 'purchase'){
                            tpl = mData.tpl_pur;
                        }
                        let avatar = mData.broadcast[0].avatar || '/common/imgs/default-avatar.png',
                            user = mData.broadcast[0].username,
                            cmuid = mData.broadcast[0].cmuid,
                            value = mData.broadcast[0].value,
                            time = mData.broadcast[0].time,
                            itemName = mData.broadcast[0].item_name || '';

                        let html = tpl.replace('%0$s', avatar)
                                        .replace('%1$s', `<i class="nick">${user}</i>`)
                                        .replace('%2$s', `<i class="credits">${value}</i>`)
                                        .replace('%3$s', `<i class="time">${time}</i>`)
                                        .replace('%4$s', `<i>${itemName}</i>`);
                        html = `<a href="participation_other.html?cmuid=${cmuid}">${html}</a>`;
                        mData.broadcast.shift();
                        notifyAnim.go(html);
                        // $('.notify .icon').addClass('shake')
                        // setTimeout(()=>{ $('.notify .icon').removeClass('shake') }, 500)
                        $('.notify-txt span').off();
                        $('.notify-txt span').on('transitionend webkitTransitionEnd', () => {
                            setTimeout( () => {
                                mData.broadcast.length && loopBroadcast();
                            }, 800);
                        });
                    }
                }
                loopBroadcast();
            }, err => {
                this.handleError(err.error);
            });
        },
        // 每日中奖用户
        getDailyRank(country = ''){
            mRequest.getTreasureRank('day', {
                country: country,
                limit: 20
            }, data => {
                const tpl = $('#rank_list').html();
                const compile = doT.template(tpl);
                const html = compile(data.rank);
                $('.rank-entry').append(html).removeClass('hide');
            },err => {
                $('.rank-entry').hide()
            })
        },
        requestList(country = ''){
            if(!mData.isRequestingList){
                mData.isRequestingList = true;
                if(!country){
                    if(localRegion && localRegion.code){
                        country = localRegion.code
                    }
                    if(sessionRegion && sessionRegion.code){
                        country = sessionRegion.code
                        mStorage.session.removeItem('select_region_result_data')
                    }
                }
                if(country == ''){
                    // 访客  请求ip接口 获取地址
                    this.getVisitorCountry()
                }
                mRequest.getProdList({
                    country: country,
                    // offset: mData.next_offset || '',
                    // limit: 10,
                }, (d, timestamp) => {
                    mData.isRequestingList = false;
                    mData.firstRequestSuccess = true;
                    mData.has_more = d.has_more;
                    // mData.next_offset = d.next_offset;
                    $('.page-loading').hide();
                    if(d.item.length == 0){
                        mSimpleUi.toast('@@i18n.main_tips_no_treasure_item');
                    }else {
                        this.renderList(d.item, timestamp);
                    }
                    !mStorage.local.getItem('ip_region_code') && mStorage.local.setItem('ip_region_code', d.country || '');
                    mReporter.reportShow(mReporter.PAGE_VIEW_MAIN, mCommon.util.getQueryVal('source') || 0, d.country || '');
                }, data => {
                    $('.page-loading').hide();
                    mData.isRequestingList = false;
                    this.handleError(data.error);
                }, () => {
                    // timeout callback
                    $('.page-loading').hide();
                    mData.isRequestingList  = false;
                    if(!mData.firstRequestSuccess){
                        mElement.treasureList.addClass('timeout').html('<p>@@i18n.main_timeout_tap</p>'); 
                    }
                });
            }
        },
        getVisitorCountry(){
            mRequest.getVisitorCountry(d => {
                $('#sel-country').html(d.country);
            },()=>{});
        },
        renderList(data, timestamp) {
            let tpl = $('#tpl_list').html(),
                compile = doT.template(tpl),
                html = compile(data);
            $('.treasure-list').append(html);
        },
        events(){
            $(window).on('scroll', throttle(this.lazyload, 500))

            // $('.index-content').on('tap', '.treasure-list.timeout', () => {
            //     $('.treasure-list').removeClass('timeout');
            //     this.requestList();
            //     $('.modal-wrapper').addClass('hide')
            //     $('.modal-container').addClass('hide')
            // })
            // 选择商品国家
            $('#sel-country').on('click', (e)=>{
                e.preventDefault();
                location.href = `../login/region.html?type=3&current=${mData.user_profile.country || ''}&redirect=${encodeURIComponent(location.href)}`;
            })


            // 弹窗按钮的 click event
            $('.sel-shipping-region').on('click', (e)=>{
                e.preventDefault();
                location.href = '../login/region.html?type=2&redirect='+encodeURIComponent(location.href)
            })
            $('.switch-region').on('click', (e)=>{
                e.preventDefault();
                const myShipping = $('.my-shipping-region').html()
                this.requestList(myShipping);
                this.swiper(myShipping);
                $('#sel-country').html(myShipping)
                $('.modal-wrapper').addClass('hide')
                $('.modal-container').addClass('hide')
            })

            $('.close-modal').on('click', ()=>{
                mStorage.session.setItem('no-more-match-region-modal', 1)
                $('.modal-wrapper').addClass('hide')
                $('.modal-container').addClass('hide')
            })

            // ME tab 点击
            $('.n-me').on('click', (e)=>{
                if(!isLogined){
                    e.preventDefault();
                    location.href = '../login/main.html?redirect=' + encodeURIComponent('../personal/me.html')
                }
            })
        },
        lazyload(event) {
            var n = 0,
            imgNum = $(".treasure-list img").length,
            img = $('.treasure-list img');
            for (var i = n; i < imgNum; i++) {
                if (img.eq(i).offset().top < parseInt($(window).height()) + parseInt($(window).scrollTop())) {
                  if (!img.eq(i).attr("src")) {
                    var src = img.eq(i).attr("data-src");
                    img.eq(i).attr("src", src);
                    n = i + 1;
                  }
                }
            }
        },
        handleError(errorCode){
            if (errorCode == 6) {
                Cookie.get('wsc_sid') && Cookie.remove('wsc_sid')
                return;
            }
            mSimpleUi.toast('@@i18n.common_tips_network_unavailable');
        },
        initScreenPromotion() {
            if (mScreenPromotion.getHasShow()) {
                return;
            }
            this.getUnusedCouponCount();
        },
        getUnusedCouponCount() {
            mRequest.getUnusedCouponCount(data => {
                if (data.coupon_unused >= 1) {
                    mScreenPromotion.init();
                    mScreenPromotion.show();
                }
            }, (data, status) => {

            })
        },
        initActivityGetReward() {
            mRequest.activityGetReward(data => {
                mActivityGetReward.init();
                mActivityGetReward.show(data.reward);
            }, (data, status) => {

            });
        }
    };
    Main.init()
})();