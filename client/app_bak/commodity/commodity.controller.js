'use strict';

function htmlToPlaintext(text) {
  return String(text).replace(/<[^>]+>/gm, '');
}

angular.module('clientApp')
.controller('CommodityCtrl',function($scope,$rootScope,$state,Commodity) {
  var params = {};
  $rootScope.title = '商品列表';
  if($state.is('commodity.tips')){
    params = {tips:true}
  }
  if($state.is('main')){
    $rootScope.title = '';
  }
  
  $scope.commodities = new Commodity(params);
})
.controller('CommodityInfoCtrl',function($scope, $rootScope, $location, $sce, $cookies, RestAlbum, Wechat,RestDoc,userAgent,comm,Alert) {
  $rootScope.title = '商品详细信息';
  $scope.loading = '<p class="text-center"><i class="fa fa-spinner fa-pulse fa-2x"></i></p>';

  $scope.carouselIndex = 0;
  $rootScope.referrer = $location.path();

  $scope.chartData = [[[10,100],[100,10]]];
  $scope.isSelling = true;
  $scope.status = {
    open:true
  };

  RestAlbum.one('commodity').one(comm.id).getList().then(function(albums){
    $scope.albums = albums;
  });

  if(comm.code){
    Alert.add('warning',comm.message);
    return;
  }
  var cover,img;
  if(comm.info&&comm.info.cover){
    img = 'http://img1.ifindu.cn/crop/w_120/h_120'+comm.info.cover;
    cover = 'http://img1.ifindu.cn/crop/w_540/h_360'+comm.info.cover;
  }else{
    img = 'http://static.ifindu.cn/91pintuan/images/logo.png';
    cover = null;
  }
  comm.cover = cover;
  if(comm.piece>0&&comm.order>=comm.piece ){
    $scope.isSoldOut = true;
  }
  var detail = comm.info.detail;
  detail = detail.replace(/<script/g, '<p style="display:none;" ');
  detail = detail.replace(/script>/g, 'p>');
  var txtDetail = htmlToPlaintext(detail);
  var groupNumStr = comm.partakers + "人成团";
  var title = comm.info.name;
  $rootScope.title = title;
  var price = "原　价: "+comm.price+"元";
  var discount = "拼团价: "+comm.discount+"元";
  var desc = price + '\n' + discount + '\n' + groupNumStr;
  var timeline = title.substr(0,16) + '~' + price + ';' + discount + ';' + groupNumStr;
  var url = $location.absUrl();

  $scope.comm_detail = $sce.trustAsHtml(detail);
  $scope.isSelling =  moment().isBefore(comm.time_end)&&comm.stat===1;

  $scope.isOffShelves = function(){
   var is_offShelves = !$scope.isSelling || $scope.isSoldOut;
   return is_offShelves;
  };
  if(comm.model === 'share'){
    RestDoc.one('model4rewardRules').get().then(function(document){
      $scope.docGroup = document;
    });
  }
  if(comm.model === 'distribution'){
    RestDoc.one('rewardRules').get().then(function(document){
      $scope.docGroup = document;
    });
  }
  if(comm.model === 'ladder'){
    $scope.docGroup = '开团当团长，率领众好友享受优惠！';
    $scope.money={
      price:comm.price,
      ladder:0,
      cheaper:0
    };
    title = '人多力量大！'+title;
    desc = '',timeline=title.substr(0,16);
    angular.forEach(comm.ladder.prices,function(val,key){
        if(val.price<this.ladder){
          this.cheaper = this.price-val.price;
        }
        if(key<3){
          desc += val.people+"人价:"+val.price+"元\n ";
          timeline += ' '+val.people+"人价:"+val.price+"元";
        }
        this.ladder = val.price;
    },$scope.money);
  }
  $scope.commodity = comm;
  var model = comm.model==='ladder'?comm.model:'distribution';
  $scope.template_url = 'app/commodity/commodity.'+model+'.html';
  $rootScope.commId = comm.id;
  $cookies.put('commId',comm.id);
  Wechat.ready({url:url,title:title,desc: desc, timeline:timeline,img:img});
})
.controller('CommodityGroupCtrl',function($scope,$rootScope,$state,$stateParams,$location, RestAddr,RestDoc,RestWechat, comm, Alert,WxAddr){
  $rootScope.title = '开团';
  $rootScope.hideBar = true;
  $scope.provinces = [
    {id:110000,name:"北京",py:'beijing'},
    {id:310000,name:"上海",py:'shanghai'},
    {id:330000,name:"浙江",py:'zhejiang'},
    {id:320000,name:"江苏",py:'jiangsu'},
    {id:440000,name:"广东",py:'guangdong'},
    {id:210000,name:"辽宁",py:'liaoning'},
    {id:520000,name:"贵州",py:'guizhou'},
    {id:340000,name:"安徽",py:'anhui'},
    {id:500000,name:"重庆",py:'chongqing'},
    {id:350000,name:"福建",py:'fujian'},
    {id:510000,name:"四川",py:'sichuan'},
    {id:120000,name:"天津",py:'tianjin'},
    {id:130000,name:"河北",py:'hebei'},
    {id:430000,name:"湖南",py:'hunan'},
    {id:460000,name:"海南",py:'hainan'},
    {id:370000,name:"山东",py:'shandong'},
    {id:140000,name:"山西",py:'shanxi'},
    {id:610000,name:"陕西",py:'shan3xi'},
    {id:230000,name:"黑龙江",py:'heilongjiang'},
    {id:220000,name:"吉林",py:'jilin'},
    {id:410000,name:"河南",py:'henan'},
    {id:420000,name:"湖北",py:'hubei'},
    {id:360000,name:"江西",py:'jiangxi'},
    {id:150000,name:"内蒙古",py:'neimenggu'},
    {id:640000,name:"宁夏",py:'ningxia'},
    {id:630000,name:"青海",py:'qinghai'},
    {id:650000,name:"新疆",py:'xinjiang'},
    {id:540000,name:"西藏",py:'xizang'},
    {id:530000,name:"云南",py:'yunnan'},
    {id:620000,name:"甘肃",py:'ganshu'},
    {id:450000,name:"广西",py:'guangxi'},
  ];
  $scope.$watch('province',function(newVal){
    if(!newVal) return;
    RestAddr.one('city').get({province:newVal.py}).then(function(data){
      $scope.cities = data.city;
      angular.forEach($scope.cities,function(val,key){
        if(val.id === $scope.address.city.id){
          $scope.city = val;
          angular.forEach($scope.city.district,function(val,key){
            if(val.id === $scope.address.district.id){
              $scope.district = val;
            }
          });
        }
      });
    });
  });

  $scope.addr_stic = {};
  $scope.addr_had = false;
  var user = $rootScope.user;
  $scope.address = {
    name:user?user.name:'',
    telephone:user?user.telephone:'',
    address:user?user.address:'',
    province:user?user.province:'',
    city:user?user.city:'',
    district:user?user.district:'',
  };
  RestAddr.one().get().then(function(data){
    if(data) {
      $scope.address = data;
      $scope.addr_stic = angular.copy(data);
      $scope.addr_had = true;
      if(data.province){
        angular.forEach($scope.provinces,function(val,key){
          if(val.id === data.province.id){
            $scope.province = val;
          }
        });
      }
    }
  });

  if(comm.model === 'share'){
    RestDoc.one('model4groupLong').get().then(function(document){
      $scope.docGroup = document;
    });
  }
  if(comm.model === 'distribution'){
    RestDoc.one('groupLong').get().then(function(document){
      $scope.docGroup = document;
    });
  }

  $scope.submitted = false;
  $scope.post = function(){
    if ($scope.postForm.$invalid) {
      $scope.submitted = true;
      return false;
    }
    if($scope.province){
      $scope.address.province = $scope.province;
      delete $scope.address.province['py'];
    }
    if($scope.city){
      $scope.address.city = angular.copy($scope.city);
      delete $scope.address.city['district'];
    }
    if($scope.district){
      $scope.address.district = $scope.district;
    }
    if (!angular.equals($scope.address,$scope.addr_stic)){
      $scope.address.id = '';
    }
    comm.one('group').post('',$scope.address).then(function(data){
      //if($scope.isAndroid){
        var url = $state.href('group.info',{id:data.id});
        location.href = url;
      //}else{
      //  $state.go('group.info',{id:data.id});
      //}
    });
  };
  $scope.cancel = function(){
    $state.go('commodity.info',{id:comm.id});
  };
  //new WxAddr();
});
