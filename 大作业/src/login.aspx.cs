using System;
using System.Web.UI;

namespace TodoWorkspace
{
    public partial class Login : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // 页面加载时的初始化代码
        }

        protected void btnLogin_Click(object sender, EventArgs e)
        {
            try
            {
                string username = txtUsername.Text.Trim();
                string password = txtPassword.Text;

                // 服务器端验证
                if (string.IsNullOrEmpty(username))
                {
                    lblMessage.Text = "用户名不能为空";
                    lblMessage.CssClass = "message error";
                    return;
                }

                if (string.IsNullOrEmpty(password))
                {
                    lblMessage.Text = "密码不能为空";
                    lblMessage.CssClass = "message error";
                    return;
                }

                // 这里可以添加数据库验证逻辑
                // 示例：验证用户凭据
                // if (UserService.ValidateUser(username, password))

                // 客户端脚本处理登录逻辑
                string script = @"
                    <script>
                        setTimeout(function() {
                            try {
                                var users = JSON.parse(localStorage.getItem('todo_users') || '[]');
                                var user = users.find(u => u.username === '" + username + @"' && u.password === '" + password + @"');
                                
                                if (user) {
                                    localStorage.setItem('todo_current_user', JSON.stringify(user));
                                    alert('登录成功！正在跳转...');
                                    window.location.href = '/';
                                } else {
                                    alert('用户名或密码错误');
                                }
                            } catch(e) {
                                console.error('登录处理错误:', e);
                                alert('登录处理失败，请重试');
                            }
                        }, 100);
                    </script>";

                ClientScript.RegisterStartupScript(this.GetType(), "LoginScript", script);
            }
            catch (Exception ex)
            {
                lblMessage.Text = "登录失败：" + ex.Message;
                lblMessage.CssClass = "message error";
            }
        }
    }
}