var auth;

auth = {
  login: function(_id, _pw, success, fail) {
    var instance;
    instance = axios.create({
      baseURL: consts.apiUrl,
      headers: {
        'id': _id,
        'pw': _pw
      }
    });
    return instance.get('account').then(function(response) {
      if (response.data === 1) {
        return success();
      } else {
        return fail();
      }
    }).catch(function(error) {
      return console.log(error);
    });
  },
  loginFromInput: function() {
    return this.login($('#inputId').val(), $('#inputPw').val(), this.goToLocatorPage, this.alertFail);
  },
  goToLocatorPage: function() {
    return location.href = '/locator.html';
  },
  alertFail: function() {
    return alert('로그인 실패');
  }
};
