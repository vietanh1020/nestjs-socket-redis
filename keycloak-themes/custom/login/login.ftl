<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng nhập - Bee.ai</title>

    <style>
        /* Tổng quan */
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-size: cover;
        }

        /* Container đăng nhập */
        .login-container {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            text-align: center;
            width: 350px;
        }

        /* Logo */
        .logo {
            width: 80px;
            margin-bottom: 1rem;
        }

        /* Tiêu đề */
        h2 {
            color: #333;
            font-size: 22px;
            margin-bottom: 1rem;
        }

        /* Social Login */
        .social-login {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 1rem;
        }

        .social-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            text-decoration: none;
            color: white;
            transition: 0.3s;
        }

        .google { background: #db4437; }
        .facebook { background: #1877f2; }
        .apple { background: #000; }
        .mobifone { background: #009688; }

        .social-btn:hover {
            opacity: 0.8;
        }

        /* Divider */
        .divider {
            margin: 15px 0;
            font-size: 14px;
            color: #666;
        }

        /* Form nhập */
        form input {
            width: 100%;
            padding: 10px;
            margin-bottom: 12px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;
        }

        /* Nút đăng nhập */
        .login-btn {
            width: 100%;
            background: #4f46e5;
            color: white;
            padding: 10px;
            font-size: 16px;
            font-weight: bold;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: 0.3s;
        }

        .login-btn:hover {
            background: #4338ca;
        }

        /* Link dưới form */
        .bottom-links a {
            font-size: 14px;
            color: #4f46e5;
            text-decoration: none;
        }

        .bottom-links a:hover {
            text-decoration: underline;
        }

        /* Đăng ký */
        p a {
            color: #4f46e5;
            font-weight: bold;
        }

        p a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <img src="${url.resourcesPath}/img/logo.jpg" alt="Bee.ai Logo" class="logo">
        
        <h2>Đăng nhập</h2>
        <div class="social-login">
            <a href="${url.loginUrl}?kc_idp_hint=google" class="social-btn google">Google</a>
            <a href="${url.loginUrl}?kc_idp_hint=facebook" class="social-btn facebook">Facebook</a>
            <a href="${url.loginUrl}?kc_idp_hint=apple" class="social-btn apple">Apple</a>
            <a href="#" class="social-btn mobifone">MobiFone</a>
        </div>
        <p class="divider">hoặc</p>
        <form action="${url.loginAction}" method="post">
            <input type="text" name="username" placeholder="Email hoặc số điện thoại" required>
            <input type="password" name="password" placeholder="Mật khẩu" required>
            <div class="bottom-links">
                <a href="${url.loginResetCredentialsUrl}">Quên mật khẩu?</a>
            </div>
            <button type="submit" class="login-btn">Đăng nhập</button>
        </form>
        <p>Bạn chưa có tài khoản? <a href="${url.registrationUrl}">Đăng ký</a></p>
    </div>
</body>
</html>
