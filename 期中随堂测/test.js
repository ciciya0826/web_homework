const form = document.getElementById('test');
const username = document.getElementById('username');
const password = document.getElementById('password');
const confirmPwd = document.getElementById('confirmPwd');
const genderRadios = document.getElementsByName('gender');
const idCard = document.getElementById('idCard');
const phone = document.getElementById('phone');

form.addEventListener('submit', function (e) {
    e.preventDefault(); 

    //用户名
    const usernameVal = username.value.trim();
    if (usernameVal.length < 8) {
        alert('用户名长度不能少于8位');
        username.focus();
        return;
    }
    const firstChar = usernameVal[0];
    if (!(firstChar === '_' || (firstChar >= 'A' && firstChar <= 'Z'))) {
        alert('用户名必须以下划线或大写字母开头');
        username.focus();
        return;
    }
    for (let i = 1; i < usernameVal.length; i++) {
        const char = usernameVal[i];
        if (!((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z') || (char >= '0' && char <= '9'))) {
            alert('用户名只能包含字母、数字和下划线');
            username.focus();
            return;
        }
    }

    //密码
    const pwdVal = password.value;
    if (pwdVal.length !== 6) {
        alert('密码必须是6位数字');
        password.focus();
        return;
    }
    for (let i = 0; i < pwdVal.length; i++) {
        if (!(pwdVal[i] >= '0' && pwdVal[i] <= '9')) {
            alert('密码必须是6位数字');
            password.focus();
            return;
        }
    }

    //密码确认
    if (pwdVal !== confirmPwd.value) {
        alert('两次密码不一致');
        confirmPwd.focus();
        return;
    }

    //性别
    let isGenderSelected = false;
    for (let i = 0; i < genderRadios.length; i++) {
        if (genderRadios[i].checked) {
            isGenderSelected = true;
            break;
        }
    }
    if (!isGenderSelected) {
        alert('请选择性别');
        return;
    }

    //身份证号
    const idVal = idCard.value.trim();
    if (idVal.length !== 18) {
        alert('身份证号必须是18位');
        idCard.focus();
        return;
    }
    const lastChar = idVal[17];
    if (lastChar !== 'X' && lastChar !== 'x' && !(lastChar >= '0' && lastChar <= '9')) {
        alert('身份证号格式错误');
        idCard.focus();
        return;
    }
    for (let i = 0; i < 17; i++) {
        if (!(idVal[i] >= '0' && idVal[i] <= '9')) {
            alert('身份证号格式错误');
            idCard.focus();
            return;
        }
    }

    //电话号码
    const phoneVal = phone.value.trim();
    if (phoneVal.length !== 11) {
        alert('手机号必须是11位');
        phone.focus();
        return;
    }
    if (phoneVal[0] !== '1' || !(phoneVal[1] >= '3' && phoneVal[1] <= '9')) {
        alert('手机号格式错误');
        phone.focus();
        return;
    }
    for (let i = 2; i < phoneVal.length; i++) {
        if (!(phoneVal[i] >= '0' && phoneVal[i] <= '9')) {
            alert('手机号格式错误');
            phone.focus();
            return;
        }
    }
    alert('表单验证通过，可提交！');
});