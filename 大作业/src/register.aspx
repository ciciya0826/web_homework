<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="register.aspx.cs" Inherits="TodoWorkspace.Register" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>用户注册 - 待办工作台</title>
    <link rel="stylesheet" href="styles/register.css" />
</head>
<body>
    <div class="register-container">
        <div class="register-form">
            <h2>待办工作台</h2>
            <p class="subtitle">用户注册</p>
            <form id="registerForm" runat="server">
                <div class="form-group">
                    <label for="txtUsername">用户名:</label>
                    <asp:TextBox ID="txtUsername" runat="server" CssClass="form-control" placeholder="请输入用户名"></asp:TextBox>
                    <span id="usernameError" class="error-message"></span>
                    <small class="form-hint">至少3个字符</small>
                </div>
                
                <div class="form-group">
                    <label for="txtPassword">密码:</label>
                    <asp:TextBox ID="txtPassword" runat="server" TextMode="Password" CssClass="form-control" placeholder="请输入密码"></asp:TextBox>
                    <span id="passwordError" class="error-message"></span>
                    <small class="form-hint">至少6个字符</small>
                </div>
                
                <div class="form-group">
                    <label for="txtConfirmPassword">确认密码:</label>
                    <asp:TextBox ID="txtConfirmPassword" runat="server" TextMode="Password" CssClass="form-control" placeholder="请再次输入密码"></asp:TextBox>
                    <span id="confirmPasswordError" class="error-message"></span>
                </div>
                
                <div class="form-group">
                    <asp:Button ID="btnRegister" runat="server" Text="注册" CssClass="btn-primary" OnClientClick="return validateForm();" OnClick="btnRegister_Click" />
                    <a href="login.aspx" class="btn-secondary">已有账号？登录</a>
                </div>
                
                <asp:Label ID="lblMessage" runat="server" CssClass="message"></asp:Label>
            </form>
        </div>
    </div>
    
    <script src="scripts/register.js"></script>
</body>
</html>