var phonenum;

phonenum = {
  phonenums: [],
  searchPhonenum: function(src, e) {
    var filted;
    if (e.key === 'Enter'.toString()) {
      filted = this.filtNonNumeric($('#phonenumSearch').val());
      if (filted !== '') {
        return this.getPhonenums(filted);
      } else {
        this.phonenums = [];
        return this.showPhonenums();
      }
    }
  },
  getPhonenums: function(kwd) {
    var _this, instance;
    _this = this;
    instance = axios.create({
      baseURL: consts.apiUrl,
      headers: {
        keyword: kwd
      }
    });
    return instance.get('phoneNumberList').then(function(response) {
      _this.phonenums = _.reverse(response.data);
      return _this.showPhonenums();
    }).catch(function(error) {
      return console.log(error);
    });
  },
  filtNonNumeric: function(str) {
    var char, i, idx, len, result;
    result = '';
    for (idx = i = 0, len = str.length; i < len; idx = ++i) {
      char = str[idx];
      if (!isNaN(char)) {
        result += char;
      }
    }
    return result;
  },
  showPhonenums: function() {
    var i, idx, len, pn, ref, results;
    $('#phonenumResult').empty();
    if (this.phonenums.length !== 0) {
      $('#afterPhonenumSearch').show();
      ref = this.phonenums;
      results = [];
      for (idx = i = 0, len = ref.length; i < len; idx = ++i) {
        pn = ref[idx];
        results.push($('#phonenumResult').append('<tr>' + `<td>${pn.pn_belong}</td>` + `<td>${pn.pn_number}</td>` + `<td onclick='phonenum.deletePhonenum(${pn.pn_idx})'>` + "<i class='fa fa-times-circle'></i>삭제" + "</td>" + '</tr>'));
      }
      return results;
    } else {
      return $('#afterPhonenumSearch').hide();
    }
  },
  savePhonenum: function(src, e) {
    var _this, phonenumBelong, phonenumNumber, phonenumObj;
    if (e.key === 'Enter'.toString()) {
      _this = this;
      phonenumNumber = this.filtNonNumeric($('#phonenumSearch').val());
      phonenumBelong = $('#phonenumBelong').val();
      if (phonenumNumber.trim() === '' || phonenumBelong.trim() === '') {
        return alert('전화번호와 번호주를 입력하세요.');
      } else {
        phonenumObj = {
          pn_number: phonenumNumber,
          pn_belong: phonenumBelong
        };
        return axios.post(consts.apiUrl + 'phoneNumberInsert', phonenumObj, {
          headers: {}
        }, {
          'Content-Type': 'application/x-www-form-urlencoded'
        }).then(function(result) {
          _this.getPhonenums(phonenumNumber);
          return $('#phonenumBelong').val('');
        }).catch(function(error) {
          return console.log(error);
        });
      }
    }
  },
  deletePhonenum: function(pnIdx) {
    var _this, headerObj, instance;
    _this = this;
    headerObj = {
      'pn_idx': pnIdx
    };
    instance = axios.create({
      baseURL: consts.apiUrl,
      headers: headerObj
    });
    return instance.delete('phoneNumberDelete').then(function(response) {
      return _this.getPhonenums(_this.filtNonNumeric($('#phonenumSearch').val()));
    }).catch(function(error) {
      return console.log(error);
    });
  }
};
