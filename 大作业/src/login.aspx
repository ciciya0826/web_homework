<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="login.aspx.cs" Inherits="TodoWorkspace.Login" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>用户登录 - 待办工作台</title>
    <link rel="stylesheet" href="styles/register.css" />
</head>
<body>
    <div class="register-container">
        <div class="register-form">
            <h2>待办工作台</h2>
            <p class="subtitle">用户登录</p>
            <form id="loginForm" runat="server">
                <div class="form-group">
                    <label for="txtUsername">用户名:</label>
                    <asp:TextBox ID="txtUsername" runat="server" CssClass="form-control" placeholder="请输入用户名"></asp:TextBox>
                    <span id="usernameError" class="error-message"></span>
                </div>
                
                <div class="form-group">
                    <label for="txtPassword">密码:</label>
                    <asp:TextBox ID="txtPassword" runat="server" TextMode="Password" CssClass="form-control" placeholder="请输入密码"></asp:TextBox>
                    <span id="passwordError" class="error-message"></span>
                </div>
                
                <div class="form-group">
                    <asp:Button ID="btnLogin" runat="server" Text="登录" CssClass="btn-primary" OnClientClick="return validateLoginForm();" OnClick="btnLogin_Click" />
                    <a href="register.aspx" class="btn-secondary">用户注册</a>
                </div>
                
                <div class="form-group">
                    <button type="button" onclick="clearAllData()" class="btn-debug">清除所有数据（调试用）</button>
                </div>
                
                <asp:Label ID="lblMessage" runat="server" CssClass="message"></asp:Label>
            </form>
        </div>
    </div>
    
    <script src="scripts/register.js"></script>
    <script>
        // 登录表单验证
        function validateLoginForm() {
            var username = document.getElementById('<%= txtUsername.ClientID %>').value.trim();
            var password = document.getElementById('<%= txtPassword.ClientID %>').value;
            
            if (username === '') {
                document.getElementById('usernameError').textContent = '请输入用户名';
                return false;
            }
            
            if (password === '') {
                document.getElementById('passwordError').textContent = '请输入密码';
                return false;
            }
            
            return true;
        }
        
        // 清除所有数据
        function clearAllData() {
            if (confirm('确定要清除所有数据吗？')) {
                localStorage.clear();
                alert('数据已清除');
                location.reload();
            }
        }
        
        // 页面加载时检查是否有用户（仅在直接访问时检查）
        window.onload = function() {
            // 只有在URL中没有来源参数时才检查用户状态
            if (!window.location.search.includes('from=')) {
                setTimeout(function() {
                    var users = localStorage.getItem('todo_users');
                    if (!users || JSON.parse(users).length === 0) {
                        // 如果没有用户，跳转到注册页面
                        window.location.href = 'register.aspx';
                    }
                }, 200);
            }
        };
    </script>
</body>
</html>