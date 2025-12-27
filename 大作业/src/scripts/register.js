// 表单验证函数
function validateForm() {
    var isValid = true;

    // 获取ASP.NET控件的实际ID
    var usernameField = document.querySelector('input[id*="txtUsername"]');
    var passwordField = document.querySelector('input[id*="txtPassword"]');
    var confirmPasswordField = document.querySelector('input[id*="txtConfirmPassword"]');

    var username = usernameField ? usernameField.value.trim() : '';
    var password = passwordField ? passwordField.value : '';
    var confirmPassword = confirmPasswordField ? confirmPasswordField.value : '';

    // 清除之前的错误信息
    clearErrors();

    // 验证用户名
    if (username === '') {
        showError('usernameError', '请输入用户名');
        isValid = false;
    } else if (username.length < 3) {
        showError('usernameError', '用户名至少需要3个字符');
        isValid = false;
    }

    // 验证密码
    if (password === '') {
        showError('passwordError', '请输入密码');
        isValid = false;
    } else if (password.length < 6) {
        showError('passwordError', '密码至少需要6个字符');
        isValid = false;
    }

    // 验证确认密码
    if (confirmPassword === '') {
        showError('confirmPasswordError', '请确认密码');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPasswordError', '两次输入的密码不一致');
        isValid = false;
    }

    return isValid;
}

// 登录表单验证
function validateLoginForm() {
    var isValid = true;

    var usernameField = document.querySelector('input[id*="txtUsername"]');
    var passwordField = document.querySelector('input[id*="txtPassword"]');

    var username = usernameField ? usernameField.value.trim() : '';
    var password = passwordField ? passwordField.value : '';

    // 清除之前的错误信息
    clearErrors();

    // 验证用户名
    if (username === '') {
        showError('usernameError', '请输入用户名');
        isValid = false;
    }

    // 验证密码
    if (password === '') {
        showError('passwordError', '请输入密码');
        isValid = false;
    }

    return isValid;
}

// 显示错误信息
function showError(elementId, message) {
    var errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// 清除错误信息
function clearErrors() {
    var errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(function (element) {
        element.textContent = '';
        element.style.display = 'none';
    });
}

// 清除所有数据
function clearAllData() {
    if (confirm('确定要清除所有数据吗？这将删除所有用户和任务数据。')) {
        localStorage.clear();
        alert('所有数据已清除');
        location.reload();
    }
}

// 页面加载完成后的初始化
document.addEventListener('DOMContentLoaded', function () {
    // 为输入框添加实时验证
    var inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
    inputs.forEach(function (input) {
        input.addEventListener('blur', function () {
            // 移除错误样式
            this.classList.remove('error');
        });

        input.addEventListener('input', function () {
            // 清除对应的错误信息
            var fieldName = this.id.replace(/.*txt/, '').toLowerCase();
            var errorElement = document.getElementById(fieldName + 'Error');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.style.display = 'none';
            }
        });
    });
});