var asset;

asset = {
  assetList: [],
  dongList: [],
  selectedAsset: null,
  getAssetList: function(_top, _bottom, _left, _right) {
    var _this, headerObj, instance;
    _this = this;
    if (fltr.filter === null) {
      fltr.filter = Object.assign({}, fltr.filterReset);
    }
    headerObj = {
      'top': _top,
      'bottom': _bottom,
      'left': _left,
      'right': _right
    };
    headerObj = Object.assign(headerObj, fltr.filter);
    instance = axios.create({
      baseURL: consts.apiUrl,
      headers: headerObj
    });
    return instance.get('assetListV4').then(function(response) {
      _this.assetList = _.reverse(response.data.asset_list);
      $('#totalAssetCount').text(response.data.total_count);
      return nMap.setAssetMarkers();
    }).catch(function(error) {
      return console.log(error);
    });
  },
  getDongList: function(_top, _bottom, _left, _right) {
    var _this, headerObj, instance;
    _this = this;
    if (fltr.filter === null) {
      fltr.filter = Object.assign({}, fltr.filterReset);
    }
    headerObj = {
      'top': _top,
      'bottom': _bottom,
      'left': _left,
      'right': _right
    };
    headerObj = Object.assign(headerObj, fltr.filter);
    instance = axios.create({
      baseURL: consts.apiUrl,
      headers: headerObj
    });
    return instance.get('assetDongsV4').then(function(response) {
      _this.dongList = _.reverse(response.data.dong_list);
      $('#totalAssetCount').text(response.data.total_count);
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
    if (fltr.filter === null) {
      fltr.filter = Object.assign({}, fltr.filterReset);
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
    $('#bldTelGwan').val(this.selectedAsset.bld_tel_gwan);
    $('#bldIpKey').val(this.selectedAsset.bld_ipkey);
    $('#bldRoomKey').val(this.selectedAsset.bld_roomkey);
    $('#bldMemo').val(this.selectedAsset.bld_memo);
    $('#bldOnWall').val(this.selectedAsset.bld_on_wall);
    $('#bldOnParked').val(this.selectedAsset.bld_on_parked);
    $('#workRequested').prop('checked', this.selectedAsset.work_requested.trim() === '' ? false : true);
    if (this.selectedAsset.photo !== '') {
      return $('#seePhoto').show();
    } else {
      return $('#seePhoto').hide();
    }
  },
  seePhoto: function() {
    return window.open(consts.photoUrl + this.selectedAsset.photo, '_blank');
  },
  saveAsset: function(rqst) {
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
      this.selectedAsset.work_requested = rqst;
    }
    strObj = Qs.stringify(this.selectedAsset);
    return axios.put(consts.apiUrl + 'asset/modifyV2', strObj, {
      headers: {
        bld_idx: this.selectedAsset.bld_idx
      }
    }, {
      'Content-Type': 'application/x-www-form-urlencoded'
    }).then(function(result) {
      nMap.getAssetsInBound();
      return request.getRequests();
    });
  },
  decodeBldType: function(code) {
    if (code === '') {
      return '미분류';
    } else {
      return code.replace('one', '원룸').replace('sg', '상가').replace('lnd', '토지').replace('hs', '주택');
    }
  }
};
