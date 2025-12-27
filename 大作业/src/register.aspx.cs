using System;
using System.Web.UI;

namespace TodoWorkspace
{
    public partial class Register : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // 页面加载时的初始化代码
        }

        protected void btnRegister_Click(object sender, EventArgs e)
        {
            try
            {
                string username = txtUsername.Text.Trim();
                string password = txtPassword.Text;
                string confirmPassword = txtConfirmPassword.Text;

                // 服务器端验证
                if (string.IsNullOrEmpty(username))
                {
                    lblMessage.Text = "用户名不能为空";
                    lblMessage.CssClass = "message error";
                    return;
                }

                if (username.Length < 3)
                {
                    lblMessage.Text = "用户名至少需要3个字符";
                    lblMessage.CssClass = "message error";
                    return;
                }

                if (string.IsNullOrEmpty(password))
                {
                    lblMessage.Text = "密码不能为空";
                    lblMessage.CssClass = "message error";
                    return;
                }

                if (password.Length < 6)
                {
                    lblMessage.Text = "密码至少需要6个字符";
                    lblMessage.CssClass = "message error";
                    return;
                }

                if (password != confirmPassword)
                {
                    lblMessage.Text = "两次输入的密码不一致";
                    lblMessage.CssClass = "message error";
                    return;
                }

                // 客户端脚本处理注册逻辑
                string script = @"
                    <script>
                        setTimeout(function() {
                            try {
                                var users = JSON.parse(localStorage.getItem('todo_users') || '[]');
                                var username = '" + username + @"';
                                var password = '" + password + @"';
                                
                                // 检查用户名是否已存在
                                if (users.some(u => u.username === username)) {
                                    alert('用户名已存在');
                                } else {
                                    // 创建新用户
                                    var newUser = {
                                        id: Date.now().toString(),
                                        username: username,
                                        email: '',
                                        password: password,
                                        createdAt: new Date().toISOString()
                                    };
                                    
                                    users.push(newUser);
                                    localStorage.setItem('todo_users', JSON.stringify(users));
                                    localStorage.setItem('todo_current_user', JSON.stringify(newUser));
                                    
                                    alert('注册成功！正在跳转...');
                                    window.location.href = '/';
                                }
                            } catch(e) {
                                console.error('注册处理错误:', e);
                                alert('注册处理失败，请重试');
                            }
                        }, 100);
                    </script>";

                ClientScript.RegisterStartupScript(this.GetType(), "RegisterScript", script);
            }
            catch (Exception ex)
            {
                lblMessage.Text = "注册失败：" + ex.Message;
                lblMessage.CssClass = "message error";
            }
        }
    }
}