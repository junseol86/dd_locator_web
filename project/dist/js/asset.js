var asset;

asset = {
  assetList: [],
  dongList: [],
  requests: [],
  selectedAsset: null,
  filter: null,
  filterReset: {
    bldType: 'one',
    noName: false,
    noNumber: false,
    noGwan: false,
    fmlyMin: -1,
    fmlyMax: -1,
    mainPurps: '',
    useaprDay: ''
  },
  getRequests: function() {
    var _this, instance;
    _this = this;
    instance = axios.create({
      baseURL: consts.apiUrl,
      headers: {}
    });
    return instance.get('assetRequestedV2').then(function(response) {
      _this.requests = _.reverse(response.data);
      console.log(_this.requests);
      return _this.showRequested();
    }).catch(function(error) {
      return console.log(error);
    });
  },
  showRequested: function() {
    var i, idx, len, ref, results, rq;
    $('#requestContainer').empty();
    ref = this.requests;
    results = [];
    for (idx = i = 0, len = ref.length; i < len; idx = ++i) {
      rq = ref[idx];
      results.push($('#requestContainer').append(`<div onclick='asset.selectRequested(${idx})'>${rq.plat_plc}</div>`));
    }
    return results;
  },
  selectRequested: function(idx) {
    this.selectedAsset = this.requests[idx];
    this.selectAssetResult();
    nMap.map.setCenter(new naver.maps.LatLng(this.requests[idx].bld_map_y, this.requests[idx].bld_map_x));
    nMap.map.setZoom(14);
    return nMap.getAssetsInBound();
  },
  getAssetList: function(_top, _bottom, _left, _right) {
    var _this, headerObj, instance;
    _this = this;
    if (this.filter === null) {
      this.filter = Object.assign({}, this.filterReset);
    }
    headerObj = {
      'top': _top,
      'bottom': _bottom,
      'left': _left,
      'right': _right
    };
    headerObj = Object.assign(headerObj, this.filter);
    instance = axios.create({
      baseURL: consts.apiUrl,
      headers: headerObj
    });
    return instance.get('assetListV2').then(function(response) {
      _this.assetList = _.reverse(response.data);
      return nMap.setAssetMarkers();
    }).catch(function(error) {
      return console.log(error);
    });
  },
  getDongList: function(_top, _bottom, _left, _right) {
    var _this, headerObj, instance;
    _this = this;
    if (this.filter === null) {
      this.filter = Object.assign({}, this.filterReset);
    }
    headerObj = {
      'top': _top,
      'bottom': _bottom,
      'left': _left,
      'right': _right
    };
    headerObj = Object.assign(headerObj, this.filter);
    instance = axios.create({
      baseURL: consts.apiUrl,
      headers: headerObj
    });
    return instance.get('assetDongsV2').then(function(response) {
      _this.dongList = _.reverse(response.data);
      return nMap.setDongMarkers();
    }).catch(function(error) {
      return console.log(error);
    });
  },
  askDeleteAsset: function() {
    if (confirm('[1차 확인] 이 매물을 삭제하시겠습니까?')) {
      if (confirm('[2차 확인] 이 매물을 삭제하시겠습니까?')) {
        return this.deleteAsset();
      }
    }
  },
  deleteAsset: function() {
    var _this, headerObj, instance;
    _this = this;
    if (this.filter === null) {
      this.filter = Object.assign({}, this.filterReset);
    }
    headerObj = {
      'bld_idx': _this.selectedAsset.bld_idx
    };
    instance = axios.create({
      baseURL: consts.apiUrl,
      headers: headerObj
    });
    return instance.delete('asset/deleteV2').then(function(response) {
      _this.assetList = [];
      _this.selectedAsset = null;
      return nMap.getAssetsInBound();
    }).catch(function(error) {
      return console.log(error);
    });
  },
  selectAsset: function(idx) {
    var _this, instance;
    _this = this;
    this.selectedAsset = null;
    instance = axios.create({
      baseURL: consts.apiUrl
    });
    return instance.get('assetV2/' + this.assetList[idx].bld_idx).then(function(response) {
      _this.selectedAsset = null;
      _this.selectedAsset = response.data;
      if (_this.selectedAsset != null) {
        return _this.selectAssetResult();
      }
    }).catch(function(error) {
      return console.log(error);
    });
  },
  selectAssetResult: function() {
    $('#oldAddr').text(this.selectedAsset.plat_plc);
    $('#newAddr').text(this.selectedAsset.new_plat_plc);
    $('#flrFml').text(this.selectedAsset.grnd_flr_cnt + ' | ' + this.selectedAsset.fmly_cnt);
    $('#useApr').text(this.selectedAsset.useapr_day);
    $('#mainPurps').text(this.selectedAsset.main_purps);
    $('#etcPurps').text(this.selectedAsset.etc_purps);
    $('#bldType').val(this.selectedAsset.bld_type);
    $('#bldName').val(this.selectedAsset.bld_name);
    $('#bldGwan').val(this.selectedAsset.bld_gwan);
    $('#bldTelOwner').val(this.selectedAsset.bld_tel_owner);
    $('#bldTelGwan').val(this.selectedAsset.bld_tel_owner);
    $('#bldIpKey').val(this.selectedAsset.bld_ipkey);
    $('#bldRoomKey').val(this.selectedAsset.bld_roomkey);
    $('#bldMemo').val(this.selectedAsset.bld_memo);
    $('#bldOnWall').val(this.selectedAsset.bld_on_wall);
    $('#bldOnParked').val(this.selectedAsset.bld_on_parked);
    return $('#workRequested').prop('checked', this.selectedAsset.work_requested.trim() === '' ? false : true);
  },
  saveAsset: function(request) {
    var _this, strObj;
    _this = this;
    if (this.selectedAsset === null) {
      alert('매물이 선택되지 않았습니다.');
    } else {
      this.selectedAsset.bld_type = $('#bldType').val();
      this.selectedAsset.bld_name = $('#bldName').val();
      this.selectedAsset.bld_gwan = $('#bldGwan').val();
      this.selectedAsset.bld_memo = $('#bldMemo').val();
      this.selectedAsset.bld_tel_owner = $('#bldTelOwner').val();
      this.selectedAsset.bld_tel_gwan = $('#bldTelGwan').val();
      this.selectedAsset.bld_ipkey = $('#bldIpKey').val();
      this.selectedAsset.bld_roomkey = $('#bldRoomKey').val();
      this.selectedAsset.bld_on_wall = $('#bldOnWall').val();
      this.selectedAsset.bld_on_parked = $('#bldOnParked').val();
      this.selectedAsset.work_requested = request;
    }
    strObj = Qs.stringify(this.selectedAsset);
    console.log(this.selectedAsset);
    return axios.put(consts.apiUrl + 'asset/modifyV2', strObj, {
      headers: {
        bld_idx: this.selectedAsset.bld_idx
      }
    }, {
      'Content-Type': 'application/x-www-form-urlencoded'
    }).then(function(result) {
      nMap.getAssetsInBound();
      return _this.getRequests();
    });
  },
  filterBldType: function(src, e) {
    this.filter.bldType = $(src).val();
    return nMap.getAssetsInBound();
  },
  filterNoName: function() {
    this.filter.noName = !this.filter.noName;
    this.setFilterInterface();
    return nMap.getAssetsInBound();
  },
  filterNoNumber: function() {
    this.filter.noNumber = !this.filter.noNumber;
    this.setFilterInterface();
    return nMap.getAssetsInBound();
  },
  filterNoGwan: function() {
    this.filter.noGwan = !this.filter.noGwan;
    this.setFilterInterface();
    return nMap.getAssetsInBound();
  },
  filterFmly: function(src, e, which) {
    if (e.key === 'Enter'.toString()) {
      if ($.isNumeric($(src).val())) {
        this.filter[which] = $(src).val();
        return nMap.getAssetsInBound();
      } else {
        if ($(src).val().trim() === '') {
          this.filter[which] = -1;
          return nMap.getAssetsInBound();
        } else {
          return alert('숫자만 입력하세요.');
        }
      }
    }
  },
  searchAddr: function(src, e) {
    var instance;
    if (e.code === 'Enter'.toString()) {
      instance = axios.create({
        baseURL: consts.apiUrl,
        headers: {
          address: encodeURIComponent($(src).val())
        }
      });
      return instance.get("locateAddress").then(function(response) {
        var pos;
        pos = response.data;
        nMap.map.setCenter(new naver.maps.LatLng(pos.y, pos.x));
        return nMap.map.setZoom(12);
      }).catch(function(error) {
        return console.log(error);
      });
    }
  },
  filterMainPurps: function(src, e) {
    if (e.key === 'Enter'.toString()) {
      this.filter.mainPurps = encodeURIComponent($(src).val());
      return nMap.getAssetsInBound();
    }
  },
  filterUseaprDay: function(src, e) {
    if (e.key === 'Enter'.toString()) {
      if (($.isNumeric($(src).val())) && ($(src).val().length === 4)) {
        this.filter.useaprDay = $(src).val();
        return nMap.getAssetsInBound();
      } else {
        if ($(src).val().trim() === '') {
          this.filter.useaprDay = -1;
          return nMap.getAssetsInBound();
        } else {
          return alert('4자리 년도만 입력하세요.');
        }
      }
    }
  },
  setFilterInterface: function() {
    if (this.filter.noName) {
      $('.onoff#noName .on').show();
      $('.onoff#noName .off').hide();
    } else {
      $('.onoff#noName .off').show();
      $('.onoff#noName .on').hide();
    }
    if (this.filter.noNumber) {
      $('.onoff#noNumber .on').show();
      $('.onoff#noNumber .off').hide();
    } else {
      $('.onoff#noNumber .off').show();
      $('.onoff#noNumber .on').hide();
    }
    if (this.filter.noGwan) {
      $('.onoff#noGwan .on').show();
      return $('.onoff#noGwan .off').hide();
    } else {
      $('.onoff#noGwan .off').show();
      return $('.onoff#noGwan .on').hide();
    }
  },
  resetFilter: function() {
    this.filter = Object.assign({}, this.filterReset);
    this.setFilterInterface();
    $('.toReset').val('');
    return nMap.getAssetsInBound();
  }
};
