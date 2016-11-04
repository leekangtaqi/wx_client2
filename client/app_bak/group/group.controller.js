'use strict';

angular.module('clientApp')
.controller('GroupCtrl',function($scope,$rootScope,$state,$stateParams,$cookies,Group) {
  $rootScope.title = '拼团列表';
  $scope.filterGrp = 'all';
  var params = {};
  if($stateParams.id){
    $scope.commId = $stateParams.id;
    $cookies.put('commId',$stateParams.id);
    params = {commodity:$stateParams.id}
  }
  if($stateParams.my){
    params = {my:$stateParams.my}
    $scope.filterGrp = 'my';
  }
  if($stateParams.filter) {
    params.filter = $stateParams.filter;
  };
  if($state.is('group.miss')){
    params.filter = 'missing';
    $scope.filterGrp = 'missing';
  }
  $scope.groups = new Group(params);
})
.controller('GroupInfoCtrl',function($scope,$rootScope,$location, $state,$sce,$cookies,$uibModal,Wechat,RestAlbum,group,RestDoc) {

  $rootScope.title =  group.address.name+'的团';
  $scope.loading = '<p class="text-center"><i class="fa fa-spinner fa-pulse fa-2x"></i></p>';
  $scope.isBefore = true;
  $scope.isSelling = true;
  $scope.statusopen = true;

  var comm = group.commodity;
  $rootScope.commId = comm.id;
  $cookies.put('commId',comm.id);
  var txtDetail = htmlToPlaintext(comm.info.name);
  var diff = group.commodity.partakers-group.num_order;
  var end_time_str = "已结束";
  var diffStr;
  if(diff>0){
    diffStr = "还差"+diff+"人成团";
  }else{
    diffStr = "已有"+group.num_order+"人参团";
  }
  if (group.isBefore) {
    end_time_str = "剩余时间: " + moment(group.time_end).fromNow();
  }

  if(comm.info.cover){
    var img = 'http://img1.ifindu.cn/crop/w_120/h_120'+comm.info.cover;
  }else{
    img = undefined;
  }

  var title = comm.info.name;
  var colonel = group.address.name;
  var group_name = colonel.substr(0,4) + '的团';
  var price = "原　价: "+comm.price+"元";
  var discount = "拼团价: "+comm.discount+"元";
  var desc = group_name + '\n' + diffStr + '\n' + end_time_str;
  var timeline = title.substr(0,16) + '~' + group_name + ',' + diffStr;
  var url = $location.absUrl();

  var detail = comm.info.detail;
  detail = detail.replace(/<script/g, '<p style="display:none;" ');
  detail = detail.replace(/script>/g, 'p>');
  $scope.comm_detail = $sce.trustAsHtml(detail);

  $scope.group = group;
  $scope.isBefore =  moment().isBefore(group.time_end);
  $scope.isSelling =  moment().isBefore(comm.time_end)&&comm.stat===1;
  $scope.isContinue = comm.continue;
  $scope.isSoldOut = false;
  if(comm.piece>0&&comm.order>=comm.piece ){
    $scope.isSoldOut = true;
  }

  RestAlbum.one('commodity').one(comm.id).getList().then(function(albums){
    $scope.albums = albums;
  });

  if(comm.paytype === 'fullpay'&&comm.model !== 'ladder'){
    RestDoc.one('fullpay').get().then(function(document){
      $scope.docJoin = document;
    });
  }
  if(comm.prepay === 'prepay'&&comm.model !== 'ladder'){
    RestDoc.one('prepay').get().then(function(document){
      $scope.docJoin = document;
    });
  }
  if(comm.model === 'ladder'){
    RestDoc.one('ladder').get().then(function(document){
      $scope.docJoin = document;
    });
    $scope.money = {
      key:0,
      price:0,
      people:0,
      order:0
    };
    title = '人多力量大！'+title;
    desc = '',timeline=title.substr(0,16);
    angular.forEach(comm.ladder.prices,function(price,key){
        if(group.num_order>=price.people){
          this.key = key;
          this.price = price.price;
          this.people = price.people;
          this.order = group.num_order;
        }
        this.max = price.people;
        if(key<3){
          desc += price.people+"人价:"+price.price+"元\n ";
          timeline += ' '+price.people+"人价:"+price.price+"元";
        }
    },$scope.money);
  }

  Wechat.ready({url:url, title:title,desc:desc,timeline:timeline,img:img});

  var model = comm.model==='ladder'?comm.model:'distribution';
  $scope.template_url = 'app/group/group.'+model+'.html';

  $scope.docGroup = '开团当团长，分享给好友们，成团后享受优惠！';

  var numJoin = $scope.group.num_order;
  var numNeed = $scope.group.commodity.partakers;

  $scope.isOffShelves = function(){
    var is_offShelves = !$scope.isSelling || $scope.isSoldOut;
    return is_offShelves;
  };
  $scope.isJoin = function(){
    var is_join = $scope.isBefore && (numJoin < numNeed || (numJoin >= numNeed && $scope.isContinue));
    return is_join;
  };
  $scope.joinModal = function(){
    if($scope.isJoin()){
      if(comm.status.sku){
        $uibModal.open({
          templateUrl: 'app/group/group.sku.modal.html',
          controller: 'GroupSkuCtrl',
          size: 'lg',
          resolve: {
            group: function () {
              return group;
            }
          }
        });
        return;
      }
      var url = $state.href('wepay',{id:group.id,showwxpaytitle:1,module:'group',action:'join'});
      location.href = url;
      return;
    }
    $uibModal.open({
      templateUrl: 'app/group/modal.post.html',
      controller: 'joinModalCtrl',
      size: 'lg',
      resolve: {
        commId: function () {
          return comm.id;
        },
        grpId: function(){
          return group.id;
        },
        isMore: function () {
          return numJoin>=numNeed?true:false;
        },
        isBefore: function(){
          return $scope.isBefore;
        },
        isSelling: function(){
          return $scope.isSelling;
        },
        isContinue: function(){
          return $scope.isContinue;
        },
        isSoldOut: function(){
          return $scope.isSoldOut;
        },
        model: function(){
          return comm.model;//分享，分销
        }
      }
    });
    return false;
  };
  $scope.share = function(){
    $uibModal.open({
      templateUrl: 'app/group/share.html'
    });
  };
})
.controller('joinModalCtrl',function ($scope, $location, $state, $uibModalInstance, commId, grpId, isBefore, isMore,isSelling,isContinue,isSoldOut,model) {
  $scope.commId = commId;
  $scope.isBefore = isBefore;
  $scope.isMore = isMore;
  $scope.isSelling = isSelling;
  $scope.isContinue = isContinue;
  $scope.isSoldOut = isSoldOut;
  $scope.model = model;
  $scope.ok = function () {
    $uibModalInstance.dismiss('开团');
    $state.go('commodity.info.group',{id:commId})
    //$location.path('group/commodity/'+commId+'/post');
  };
  $scope.goon = function () {
    $uibModalInstance.dismiss('继续参加');
    $location.path('group/'+grpId+'/join');
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})
.controller('GroupJoinCtrl',function(
  $scope, $rootScope, $state, $stateParams,$uibModal,$log,
  $location, $timeout,$cookies, RestAddr, RestGrp, RestWxPoi, Address) {
  $rootScope.title = '参团';
  /*
  wx.openAddress({
      success: function (data) {
        // 用户成功拉出地址
        alert(data);
      },
      cancel: function () {
            // 用户取消拉出地址
      }
  });//*/
  $scope.area = {province:'',city:'',district:''};
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
  $scope.totalFee = 0;
  function startToWatch(){
    $scope.$watch('area.district', function(){
      if(!$scope.isLimitPurchase){
        return;
      }
      if($scope.area.district){
        var item = $scope.tpl.items.filter(function(i){
          return i.deliveryArea.filter(function(area){
            return area.id === $scope.area.district.id
          }).length >0
        })[0];
        $scope.deliveryPayment = item.payment;
      }
    });
    $scope.$watch('area.city', function(){
      $scope.deliveryPayment = 0;
    })
    $scope.$watch('area.province',function(newVal){
      $scope.deliveryPayment = 0;
      if(!newVal){
        $scope.cities = null;
        return;
      };
      var promise = null;
      if($scope.isLimitPurchase){
        promise = Promise.resolve(Address.getChildren($scope.addresses, newVal.id));
      }else{
        promise = RestAddr.one('city').get({province:newVal.py});
      }
      promise.then(function(cities){
        if($scope.isLimitPurchase){
          cities.forEach(function(city){
            city.district = Address.getChildren($scope.addresses, city.id);
          })
          $scope.cities = cities;
        }else{
          $scope.cities = cities.city;
        }
        angular.forEach($scope.cities,function(val,key){
          if(val.id === $scope.address.city.id){
            $scope.area.city = val;
            angular.forEach($scope.area.city.district,function(val,key){
              if(val.id === $scope.address.district.id){
                $scope.area.district = val;
              }
            });
          }
        });
        if($scope.isLimitPurchase){
            $scope.$apply();
        }
      });
    });
  }
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
            $scope.area.province = val;
          }
        });
      }
    }
  });

  RestGrp.one($stateParams.id).get().then(function(group){
    $scope.group = group;
    $scope.submitted = false;
    $scope.submiting = false;
    $scope.isLimitPurchase = false;
    if(group.commodity.consumeType === '1'
    && group.commodity.logistic
    && group.commodity.logistic.type === '1'
    ){
      $scope.tpl = group.commodity.logistic.template;
      var originItems = $scope.tpl.items
        .map(function(i){return i.deliveryArea})
        .reduce(function(acc, curr){
          return acc.concat(curr);
        }, []);
      $scope.isLimitPurchase = true;
      $scope.addresses = Address.distinct(originItems);
      $scope.addresses = Address.format(originItems, 'text', 'name');
      $scope.provinces = Address.getChildren($scope.addresses, null);
    }
    $scope.participate = function() {
      if ($scope.joinForm.$invalid) {
        $scope.submitted = true;
        return false;
      }
      $scope.submiting = true;
      $timeout(function() {$scope.submiting = false;},5000);

      if($scope.area.province){
        $scope.address.province = $scope.area.province;
        delete $scope.address.province['py'];
      }
      if($scope.area.city){
        $scope.address.city = angular.copy($scope.area.city);
        delete $scope.address.city['district'];
      }
      if($scope.area.district){
        $scope.address.district = $scope.area.district;
      }
      $scope.addr_stic.remark = $scope.address.remark;
      if (!angular.equals($scope.address,$scope.addr_stic)){
        $scope.address.id = '';
      }
      //添加sku信息
      var key = 'grp_sku_'+group.id;
      var skuCki = $cookies.get(key);
      if(skuCki) $scope.address.sku = skuCki;
      group.one('join').post(null,$scope.address).then(function(data){
        wx.chooseWXPay({
          timestamp: data.timestamp,
          nonceStr : data.nonceStr,
          package  : data.package,
          signType : data.signType,
          paySign  : data.paySign,
          success  : function(res) {
            $cookies.remove(key);//删除sku信息
            var url = $state.href(data.state,{id:data.id});
            location.href = url;
          },
          cancel   : function(res) {
            $scope.submiting = false;
            $state.go(data.state,{id:id});
          },
          fail     : function(res) {
            $scope.submiting = false;
            $state.go(data.state,{id:id});
          }
        });
      });
      return false;
    };
    startToWatch();
    $scope.totalFee = group.commodity.model==='ladder'?group.commodity.ladder.prepay:group.commodity.prepay;
    $scope.poi_loaded = false;
    if(group.commodity.status.lbs){
      wx.ready(function(){
        wx.getLocation({
          success: function (res) {
            RestWxPoi.get({
              tag:group.commodity.poitag,
              latitude:res.latitude,
              longitude:res.longitude
            }).then(function (pois) {
              $scope.pois = pois;
              $scope.poi_loaded = true;
            })
          },
          cancel: function (res) {Alert.add('warning','您拒绝授权获取地理位置');},
          fail: function(res){location.reload();}
        });
      });
    }else{
      RestWxPoi.get({
        tag:group.commodity.poitag
      }).then(function (pois) {
        $scope.pois = pois;
        $scope.poi_loaded = true;
      })
    }
    $scope.poiSelModal = function (params) {
      var pois = $scope.pois;
      var address = $scope.address;
      var modalInstance = $uibModal.open({
            templateUrl: 'app/group/group.poi.modal.html',
            controller: 'GroupPoiModalCtrl',
            size: 'lg',
            resolve: {
              pois: function () {
                return pois;
              },
              address: function(){
                return address;
              }
            }
          });
      modalInstance.result.then(function (poi) {
        $scope.address.poi = poi;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    }
  });
})
.controller('GroupReplenishmentCtrl',function($scope,$rootScope,$stateParams,$state,RestGrp, RestPtk){
  $rootScope.title = '拼团补款';
  RestPtk.one('i').get({group: $stateParams.id}).then(function(ptk){
    $scope.deliveryPayment = ptk.freight;
  }).then(function(){
    return RestGrp.one($stateParams.id).get()
  }).then(function(group){
    $scope.group = group;
    var comm = group.commodity;
    $scope.isSelling =  moment().isBefore(comm.time.end);
    if(comm.model === 'ladder'){
      $scope.money = {
        price:comm.price,
        maxs:0
      };
      angular.forEach(comm.ladder.prices,function(price,key){
        console.log(this.maxs,price.people);
        if(group.num_order>=price.people&&this.maxs<price.people){
          this.price = price.price;
          this.maxs = price.people;
        }
      },$scope.money);
    }
    $scope.replenishment = function() {
      group.one('order').post().then(function(data){
        wx.chooseWXPay({
          timestamp: data.timestamp,
          nonceStr : data.nonceStr,
          package  : data.package,
          signType : data.signType,
          paySign  : data.paySign,
          success  : function(res) {
            var url = $state.href(data.state,{id:data.id});
            location.href = url;
          },
          cancel   : function(res) {
            $state.go(data.state,{id:id});
          },
          fail     : function(res) {
            $state.go(data.state,{id:id});
          }
        });
      });
      return false;
    };
  })
})
.controller('GroupSkuCtrl',function($scope,$rootScope,$stateParams,$state,$cookies,Alert,RestComm,group){
  $scope.commodity = group.commodity;
  $scope.items = [];
  RestComm.one(group.commodity.id).one('sku').one('stock').get().then(function(stocks){
    $scope.stocks = stocks;
  });
  $scope.goPay = function(idx){
    if($scope.items.length<1){
      Alert.add('warning','请选择规格');
      return false;
    }
    for(var i=0;i<group.commodity.sku.length;i++){
      if(!$scope.items[i]) {
        Alert.add('warning','请选择规格');
        return false;
      }
    }
    var key = 'grp_sku_'+$stateParams.id;
    RestComm.one(group.commodity.id)
      .one('sku').one('stock')
      .post('',{skus:$scope.items}).then(function(stocks){
        // 使用的stock
        $cookies.put(key,stocks.id);
        location.href = $state.href('wepay',{id:group.id,showwxpaytitle:1,module:'group',action:'join'});
    });
  }
})
.controller('GroupPoiModalCtrl',function($scope,$uibModalInstance,$window,pois,address){
    $scope.pois  = pois;
    $scope.address = address;
    $scope.selPoi = function(){
      var poi = this.poi;
      $uibModalInstance.close(poi);
    }
    $scope.screen = {height:$window.innerHeight,width:$window.innerWidth};
});
