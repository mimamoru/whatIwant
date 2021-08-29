import * as yup from "yup";

const localeJP = {
  mixed: {
    required: "【${path}】必須項目です",
    oneOf: "【${path}】パスワードが一致しません",
  },
  string: {
    min: "【${path}】${min}文字以上で指定してください",
    max: "【${path}】${max}文字以下で指定してください",
    url: "【${path}は有効なURLを指定してください",
    email: "【${path}】正しい形式で指定してください",
    password: "【${path}】正しい形式で指定してください",
    match: "【${path}】半角英数字で指定してください",
  },
  number: {
    min: "【${path}】${min}以上で指定してください",
    max: "【${path}】${max}以下で指定してください",
    positive: "【${path}】正の数を指定してください",
    integer: "【${path}】整数を指定してください",
  },
  date: {
    min: "【${path}】${min}以降の日付を指定してください",
  },
};

yup.addMethod(yup.string, "alphanumeric", function (path) {
  return this.test(
    "alphanumeric",
    "【${path}】半角英数字で指定してください",
    function (value) {
      if (value == null || value === "") return true;
      return value.match(/^[0-9a-zA-Z]+$/);
    }
  );
});

yup.addMethod(yup.string, "minValid", function (path) {
  return this.test(
    "minSymbols",
    "【${path}】半角英小文字・大文字と半角数字を全て含めてください",
    function (value) {
      const reg = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])/);
      if (reg.test(value)) {
        return true;
      }
      return false;
    }
  );
});

yup.setLocale(localeJP);

export const BaseYup = yup;
