auth = {
  login: (_id, _pw, success, fail) ->
    instance = axios.create {
      baseURL: consts.apiUrl
      headers: {
        'id': _id
        'pw': _pw
      }
    }
    instance.get 'account'
    .then (response) ->
      if response.data == 1
        success()
      else
        fail()
    .catch (error) ->
      console.log(error)

  loginFromInput: () ->
    this.login $('#inputId').val(), $('#inputPw').val(), this.goToLocatorPage, this.alertFail

  goToLocatorPage: () ->
    location.href = '/locator.html'

  alertFail: () ->
    alert '로그인 실패'
}
